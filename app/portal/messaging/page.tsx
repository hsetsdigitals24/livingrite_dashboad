'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

const mockConversations = [
  { id: '1', name: 'Sarah Johnson', role: 'Care Team', unread: 2 },
  { id: '2', name: 'Dr. Smith', role: 'Doctor', unread: 0 },
  { id: '3', name: 'Jennifer Lee', role: 'Nurse', unread: 0 },
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Sarah Johnson',
    senderRole: 'Care Team',
    content: 'Good morning! How are you feeling today?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isOwn: false,
  },
  {
    id: '2',
    sender: 'You',
    senderRole: 'Client',
    content: 'Feeling pretty good, thanks for asking!',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    isOwn: true,
  },
  {
    id: '3',
    sender: 'Sarah Johnson',
    senderRole: 'Care Team',
    content: 'That\'s great! Have you taken your medications?',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    isOwn: false,
  },
  {
    id: '4',
    sender: 'You',
    senderRole: 'Client',
    content: 'Yes, I took them with breakfast.',
    timestamp: new Date(Date.now() - 30 * 1000),
    isOwn: true,
  },
];

export default function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        senderRole: 'Client',
        content: messageText,
        timestamp: new Date(),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-180px)] flex gap-4">
      {/* Conversations List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">Messages</h2>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {mockConversations.map((conv, idx) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedConversation(conv.id)}
              className={`w-full px-4 py-3 border-b border-gray-100 text-left transition-all duration-200 hover:bg-gray-50 ${
                selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{conv.name}</p>
                  <p className="text-sm text-gray-500">{conv.role}</p>
                </div>
                {conv.unread > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {conv.unread}
                  </motion.span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="font-semibold text-gray-900">
            {mockConversations.find(c => c.id === selectedConversation)?.name}
          </h3>
          <p className="text-sm text-gray-500">
            {mockConversations.find(c => c.id === selectedConversation)?.role}
          </p>
        </div>

        {/* Messages */}
        <motion.div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div
                layout
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  msg.isOwn
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.isOwn ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 border-t border-gray-200 bg-gray-50"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Send
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
