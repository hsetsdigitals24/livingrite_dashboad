import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/messages/send
 * Send a message to create or continue a conversation
 * Client sends to caregiver, caregiver sends to client
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { role, id: senderId } = session.user;
    const { recipientId, caregiverId: receivingCaregiverId, patientId, content } = await req.json();

    // Validate input
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Accept either recipientId or caregiverId for backwards compatibility
    const finalRecipientId = recipientId || receivingCaregiverId;

    if (!finalRecipientId || !patientId) {
      return NextResponse.json(
        { error: 'Recipient ID and patient ID are required' },
        { status: 400 }
      );
    }

    // Validate user role for messaging
    if (role !== 'CLIENT' && role !== 'CAREGIVER') {
      return NextResponse.json(
        { error: 'Messaging not available for this role' },
        { status: 403 }
      );
    }

    // Resolve the (clientId, caregiverId) pair up-front so we can batch every
    // independent validation query into a single round-trip.
    const clientId = role === 'CLIENT' ? senderId : finalRecipientId;
    const caregiverId = role === 'CAREGIVER' ? senderId : finalRecipientId;

    const [patient, familyAssignment, caregiverAssignment, existingConversation] =
      await Promise.all([
        prisma.patient.findUnique({
          where: { id: patientId },
          select: { id: true },
        }),
        prisma.familyMemberAssignment.findUnique({
          where: { patientId_clientId: { patientId, clientId } },
          select: { id: true },
        }),
        prisma.patientCaregiverAssignment.findUnique({
          where: { patientId_caregiverId: { patientId, caregiverId } },
          select: { id: true },
        }),
        prisma.conversation.findUnique({
          where: {
            patientId_clientId_caregiverId: { patientId, clientId, caregiverId },
          },
        }),
      ]);

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    if (!familyAssignment) {
      return NextResponse.json(
        {
          error:
            role === 'CLIENT'
              ? 'You do not have access to this patient'
              : 'Client does not have access to this patient',
        },
        { status: 403 }
      );
    }

    if (!caregiverAssignment) {
      return NextResponse.json(
        {
          error:
            role === 'CAREGIVER'
              ? 'You are not assigned to this patient'
              : 'Caregiver is not assigned to this patient',
        },
        { status: 403 }
      );
    }

    const now = new Date();
    const conversation =
      existingConversation ??
      (await prisma.conversation.create({
        data: { patientId, clientId, caregiverId, lastMessageAt: now },
      }));

    // Create the message and bump the conversation's lastMessageAt in parallel
    // — they share no dependency.
    const [message] = await Promise.all([
      prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId,
          content: content.trim(),
        },
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
      }),
      prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: now },
      }),
    ]);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
