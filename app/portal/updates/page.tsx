'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Update {
  id: string;
  title: string;
  content: string;
  type: 'daily_update' | 'health_assessment' | 'medication_log' | 'incident_report';
  urgent: boolean;
  createdBy: string;
  createdAt: Date;
  attachments?: string[];
}

const mockUpdates: Update[] = [
  {
    id: '1',
    title: 'Morning Care Session',
    content: 'Completed morning routine successfully. Vital signs stable, appetite good.',
    type: 'daily_update',
    urgent: false,
    createdBy: 'Sarah Johnson',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Weekly Health Assessment',
    content: 'Blood pressure reading slightly elevated. Recommend monitoring and follow-up appointment next week.',
    type: 'health_assessment',
    urgent: true,
    createdBy: 'Dr. Smith',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Medication Log',
    content: 'All medications administered as scheduled. No side effects reported.',
    type: 'medication_log',
    urgent: false,
    createdBy: 'Sarah Johnson',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

const typeColors: Record<Update['type'], string> = {
  daily_update: 'from-blue-50 to-blue-100 border-blue-200',
  health_assessment: 'from-red-50 to-red-100 border-red-200',
  medication_log: 'from-green-50 to-green-100 border-green-200',
  incident_report: 'from-amber-50 to-amber-100 border-amber-200',
};

const typeIcons: Record<Update['type'], string> = {
  daily_update: '📋',
  health_assessment: '🏥',
  medication_log: '💊',
  incident_report: '⚠️',
};

export default function UpdatesPage() {
  const [updates] = useState<Update[]>(mockUpdates);
  const [filter, setFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredUpdates = filter ? updates.filter((u) => u.type === filter) : updates;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Care Updates
        </h1>
        <p className="text-gray-600">Real-time updates from your care team</p>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {[null, 'daily_update', 'health_assessment', 'medication_log', 'incident_report'].map((type) => (
          <motion.button
            key={type || 'all'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(type as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === type
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {type === null ? '📊 All' : `${typeIcons[type as keyof typeof typeIcons]} ${type.replace(/_/g, ' ')}`}
          </motion.button>
        ))}
      </motion.div>

      {/* Updates Feed */}
      <div className="space-y-4">
        {filteredUpdates.map((update, idx) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -2 }}
            onClick={() => setExpandedId(expandedId === update.id ? null : update.id)}
            className={`bg-gradient-to-br ${typeColors[update.type]} border-l-4 rounded-xl shadow-sm hover:shadow-lg cursor-pointer overflow-hidden transition-all duration-300 ${
              update.urgent ? 'border-l-red-600 ring-2 ring-red-200' : 'border-l-gray-300'
            }`}
          >
            <motion.div className="p-6" layout>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl">{typeIcons[update.type]}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{update.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{update.createdBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {update.urgent && (
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold"
                    >
                      URGENT
                    </motion.span>
                  )}
                  <span className="text-xs text-gray-600 font-medium">{formatTime(update.createdAt)}</span>
                </div>
              </div>

              {/* Content */}
              <motion.div
                initial={false}
                animate={{
                  height: expandedId === update.id ? 'auto' : 60,
                  overflow: 'hidden',
                }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-700 leading-relaxed">{update.content}</p>
              </motion.div>

              {/* Attachments */}
              {expandedId === update.id && update.attachments && update.attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-4 pt-4 border-t border-gray-200 border-opacity-50"
                >
                  <p className="text-sm font-medium text-gray-900 mb-2">Attachments</p>
                  <div className="flex gap-2 flex-wrap">
                    {update.attachments.map((file) => (
                      <motion.button
                        key={file}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-2 bg-white bg-opacity-60 hover:bg-opacity-100 rounded-lg text-sm font-medium text-gray-700 transition-all"
                      >
                        📎 {file}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUpdates.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-gray-500 text-lg">No updates found</p>
        </motion.div>
      )}
    </div>
  );
}
