import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/messages/conversations
 * Get all conversations for the current user (client or caregiver)
 * Returns list of conversations with unread count
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { role, id: userId } = session.user;

    // Validate user has messaging access
    if (role !== 'CLIENT' && role !== 'CAREGIVER') {
      return NextResponse.json(
        { error: 'Messaging not available for this role' },
        { status: 403 }
      );
    }

    let conversations;

    if (role === 'CLIENT') {
      // Get conversations where user is a client
      conversations = await prisma.conversation.findMany({
        where: { clientId: userId },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
          caregiver: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { lastMessageAt: 'desc' },
      });
    } else {
      // Get conversations where user is a caregiver
      conversations = await prisma.conversation.findMany({
        where: { caregiverId: userId },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { lastMessageAt: 'desc' },
      });
    }

    // Add unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            isRead: false,
            senderId: { not: userId }, // Messages from others, not self
          },
        });
        return {
          ...conversation,
          unreadCount,
          lastMessage: conversation.messages[0] || null,
        };
      })
    );

    return NextResponse.json(conversationsWithUnread, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to fetch conversations';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
