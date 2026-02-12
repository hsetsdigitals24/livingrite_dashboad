'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MessageThread } from '../../components/MessageThread';

interface ConversationData {
  id: string;
  patient: {
    firstName: string;
    lastName: string;
  };
  caregiver: {
    id: string;
    name: string;
    image: string | null;
  };
}

export default function ClientMessageDetailPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const router = useRouter();
  const { data: session } = useSession();
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    fetchConversation();
  }, [conversationId]);

  const fetchConversation = async () => {
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      const conversations = await response.json();
      const found = conversations.find((c: ConversationData) => c.id === conversationId);
      if (!found) {
        setError('Conversation not found');
      } else {
        setConversation(found);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversation) return;

    const response = await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientId: conversation.caregiver.id,
        patientId: (conversation as any).patientId,
        content,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view messages</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Conversation not found'}</p>
          <button
            onClick={() => router.push('/client/messages')}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Back to messages
          </button>
        </div>
      </div>
    );
  }

  const patientName = `${conversation.patient.firstName} ${conversation.patient.lastName}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col bg-white shadow">
        <button
          onClick={() => router.push('/client/messages')}
          className="text-blue-500 hover:text-blue-600 p-4 text-sm font-medium border-b border-gray-200"
        >
          ← Back to messages
        </button>
        <MessageThread
          conversationId={conversationId}
          currentUserId={session.user!.id}
          caregiverName={conversation.caregiver.name || 'Caregiver'}
          caregiverImage={conversation.caregiver.image}
          patientName={patientName}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
