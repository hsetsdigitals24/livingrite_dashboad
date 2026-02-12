'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Conversation {
  id: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
  client: {
    id: string;
    name: string | null;
    image: string | null;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  } | null;
  unreadCount: number;
}

export function ConversationListCaregiver() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchConversations();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading conversations...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No conversations yet</p>
        <p className="text-sm mt-2">Messages from family members will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => router.push(`/caregiver/messages/${conversation.id}`)}
          className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {conversation.client.image && (
                <Image
                  src={conversation.client.image}
                  alt={conversation.client.name || 'Family Member'}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900">
                  {conversation.client.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Patient: {conversation.patient.firstName} {conversation.patient.lastName}
                </p>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-2">
              {conversation.lastMessage && (
                <span className="text-xs text-gray-400">
                  {formatTime(conversation.lastMessage.createdAt)}
                </span>
              )}
              {conversation.unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
