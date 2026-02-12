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

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    if (role === 'CLIENT') {
      // Client sending to caregiver - verify client has access to patient
      const familyAssignment = await prisma.familyMemberAssignment.findUnique({
        where: {
          patientId_clientId: {
            patientId,
            clientId: senderId,
          },
        },
      });

      if (!familyAssignment) {
        return NextResponse.json(
          { error: 'You do not have access to this patient' },
          { status: 403 }
        );
      }

      // Verify caregiver is assigned to patient
      const caregiverAssignment =
        await prisma.patientCaregiverAssignment.findUnique({
          where: {
            patientId_caregiverId: {
              patientId,
              caregiverId: finalRecipientId,
            },
          },
        });

      if (!caregiverAssignment) {
        return NextResponse.json(
          { error: 'Caregiver is not assigned to this patient' },
          { status: 403 }
        );
      }
    } else if (role === 'CAREGIVER') {
      // Caregiver sending to client - verify caregiver is assigned to patient
      const caregiverAssignment =
        await prisma.patientCaregiverAssignment.findUnique({
          where: {
            patientId_caregiverId: {
              patientId,
              caregiverId: senderId,
            },
          },
        });

      if (!caregiverAssignment) {
        return NextResponse.json(
          { error: 'You are not assigned to this patient' },
          { status: 403 }
        );
      }

      // Verify client has access to patient
      const familyAssignment = await prisma.familyMemberAssignment.findUnique({
        where: {
          patientId_clientId: {
            patientId,
            clientId: finalRecipientId,
          },
        },
      });

      if (!familyAssignment) {
        return NextResponse.json(
          { error: 'Client does not have access to this patient' },
          { status: 403 }
        );
      }
    }

    // Get or create conversation
    const clientId = role === 'CLIENT' ? senderId : finalRecipientId;
    const caregiverId = role === 'CAREGIVER' ? senderId : finalRecipientId;

    let conversation = await prisma.conversation.findUnique({
      where: {
        patientId_clientId_caregiverId: {
          patientId,
          clientId,
          caregiverId,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          patientId,
          clientId,
          caregiverId,
          lastMessageAt: new Date(),
        },
      });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Update conversation's lastMessageAt
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
