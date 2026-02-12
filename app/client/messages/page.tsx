'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { StartConversationModal } from '../components/StartConversationModal';

interface Conversation {
  id: string;
  patientId: string;
  clientId: string;
  caregiverId: string;
  lastMessageAt: string | null;
  unreadCount: number;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
  caregiver: {
    id: string;
    name: string;
    image: string | null;
  };
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
  } | null;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

export default function ClientMessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/messages');
        
        if (!res.ok) {
          throw new Error('Failed to fetch conversations');
        }

        const data = await res.json();
        setConversations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchConversations();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [session?.user?.id]);

  // Fetch patients for the new conversation modal
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/client/patients');
        if (res.ok) {
          const data = await res.json();
          setPatients(data);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    if (session?.user?.id) {
      fetchPatients();
    }
  }, [session?.user?.id]);

  const handleStartConversation = (patientId: string) => {
    if (!patientId) {
      setError('No patients available. Please create a patient first.');
      return;
    }
    setSelectedPatientId(patientId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPatientId(null);
    // Refresh conversations
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
        }
      } catch (error) {
        console.error('Error refreshing conversations:', error);
      }
    };
    fetchConversations();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No messages yet';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const truncateMessage = (text: string | null | undefined) => {
    if (!text) return 'No messages yet';
    return text.length > 50 ? text.substring(0, 50) + '...' : text;
  };

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please sign in to view messages</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              onClick={() => handleStartConversation(selectedPatientId || (patients[0]?.id || ''))}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={patients.length === 0}
            >
              New Conversation
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : conversations.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
            <p className="text-gray-600 mb-6">
              Start a new conversation with a caregiver to get started
            </p>
            <Button
              onClick={() => handleStartConversation(patients[0]?.id || '')}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={patients.length === 0}
            >
              Start Your First Conversation
            </Button>
          </div>
        ) : (
          /* Conversations List */
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <Link key={conversation.id} href={`/client/messages/${conversation.id}`}>
                <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition p-4 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {conversation.patient.firstName} {conversation.patient.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            with {conversation.caregiver.name}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 truncate">
                        {truncateMessage(conversation.lastMessage?.content)}
                      </p>
                    </div>

                    <div className="ml-4 flex flex-col items-end">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(conversation.lastMessageAt)}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="mt-2 inline-block bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Start Conversation Modal */}
      {selectedPatientId && (
        <StartConversationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          patientId={selectedPatientId}
        />
      )}
    </div>
  );
}
