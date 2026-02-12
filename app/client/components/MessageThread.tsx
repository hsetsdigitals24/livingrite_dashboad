'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
}

interface MessageThreadProps {
  conversationId: string;
  currentUserId: string;
  caregiverName: string;
  caregiverImage: string | null;
  patientName: string;
  onSendMessage: (content: string) => Promise<void>;
}

export function MessageThread({
  conversationId,
  currentUserId,
  caregiverName,
  caregiverImage,
  patientName,
  onSendMessage,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/messages/conversations/${conversationId}?page=1&limit=50`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.messages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading messages...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          {caregiverImage && (
            <Image
              src={caregiverImage}
              alt={caregiverName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="font-semibold text-gray-900">{caregiverName}</h2>
            <p className="text-sm text-gray-600">Patient: {patientName}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>
        )}

        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, idx) => {
              const showDate =
                idx === 0 ||
                formatDate(messages[idx - 1].createdAt) !== formatDate(message.createdAt);

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center text-xs text-gray-400 my-4">
                      {formatDate(message.createdAt)}
                    </div>
                  )}
                  <div
                    className={`flex gap-3 ${
                      message.senderId === currentUserId ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {message.senderId !== currentUserId && caregiverImage && (
                      <Image
                        src={caregiverImage}
                        alt="Caregiver"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div
                      className={`max-w-xs ${
                        message.senderId === currentUserId ? 'mr-8' : 'ml-8'
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.senderId === currentUserId
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                      </div>
                      <span
                        className={`text-xs text-gray-500 mt-1 block ${
                          message.senderId === currentUserId ? 'text-right' : ''
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
