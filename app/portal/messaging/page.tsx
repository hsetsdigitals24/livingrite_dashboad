'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  sender: string;
  role: string;
  avatar: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  online: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Primary Physician',
    avatar: '👩‍⚕️',
    lastMessage: 'How are you feeling today?',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Nurse Maria',
    role: 'Care Coordinator',
    avatar: '👩‍🏫',
    lastMessage: 'Medications refilled',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'James PT',
    role: 'Physical Therapist',
    avatar: '💪',
    lastMessage: 'Great progress on exercises',
    unread: 1,
    online: true,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Dr. Sarah Johnson',
    role: 'Physician',
    avatar: '👩‍⚕️',
    content: 'Good morning! How are you feeling today?',
    timestamp: '9:30 AM',
    isOwn: false,
  },
  {
    id: '2',
    sender: 'You',
    role: 'Patient',
    avatar: '👤',
    content: 'Feeling much better, thanks for asking!',
    timestamp: '9:45 AM',
    isOwn: true,
  },
  {
    id: '3',
    sender: 'Dr. Sarah Johnson',
    role: 'Physician',
    avatar: '👩‍⚕️',
    content: 'That\'s wonderful! Please continue with your current treatment plan.',
    timestamp: '10:00 AM',
    isOwn: false,
  },
  {
    id: '4',
    sender: 'You',
    role: 'Patient',
    avatar: '👤',
    content: 'Will do. Any dietary changes I should make?',
    timestamp: '10:15 AM',
    isOwn: true,
  },
  {
    id: '5',
    sender: 'Dr. Sarah Johnson',
    role: 'Physician',
    avatar: '👩‍⚕️',
    content: 'Continue with the low-sodium diet. See you next week!',
    timestamp: '10:30 AM',
    isOwn: false,
  },
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
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(mockConversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="max-w-6xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
          Messages
        </h1>
        <p className="text-gray-600">Direct communication with your care team</p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-rose-50">
            <h2 className="font-bold text-gray-900">Conversations</h2>
          </div>

          <div className="overflow-y-auto flex-1 space-y-1 p-2">
            {mockConversations.map((conv, idx) => (
              <motion.button
                key={conv.id}
                variants={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 relative ${
                  selectedConversation.id === conv.id
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  <span className="text-2xl">{conv.avatar}</span>
                  {conv.online && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${selectedConversation.id === conv.id ? 'text-white' : 'text-gray-900'}`}>
                    {conv.name}
                  </p>
                  <p className={`text-xs truncate ${selectedConversation.id === conv.id ? 'text-white opacity-80' : 'text-gray-600'}`}>
                    {conv.role}
                  </p>
                </div>
                {conv.unread > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      selectedConversation.id === conv.id ? 'bg-white bg-opacity-20 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {conv.unread}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-rose-50">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedConversation.avatar}</span>
              <div>
                <h3 className="font-bold text-gray-900">{selectedConversation.name}</h3>
                <p className="text-sm text-gray-600">{selectedConversation.role}</p>
              </div>
              <div className="ml-auto flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 hover:bg-white rounded-lg transition-all"
                >
                  📞
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 hover:bg-white rounded-lg transition-all"
                >
                  📹
                </motion.button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
            {mockMessages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-xs ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                  <span className="text-2xl">{msg.avatar}</span>
                  <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                    <p className="text-xs text-gray-600 mb-1">{msg.timestamp}</p>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`px-4 py-3 rounded-2xl ${
                        msg.isOwn
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-900 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-3 hover:bg-gray-100 rounded-lg transition-all"
              >
                📎
              </motion.button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold transition-all"
              >
                Send
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
