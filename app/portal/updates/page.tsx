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
  daily_update: 'bg-blue-100 text-blue-800 border-blue-300',
  health_assessment: 'bg-red-100 text-red-800 border-red-300',
  medication_log: 'bg-green-100 text-green-800 border-green-300',
  incident_report: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

export default function UpdatesPage() {
  const [updates] = useState<Update[]>(mockUpdates);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Care Updates</h1>
        <p className="text-gray-600 mb-8">Real-time updates from your care team</p>
      </motion.div>

      <div className="space-y-4">
        {updates.map((update, idx) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setExpandedId(expandedId === update.id ? null : update.id)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200"
          >
            <motion.div
              className="p-6"
              layout
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {update.title}
                    </h3>
                    {update.urgent && (
                      <span className="animate-pulse px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        URGENT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className={`px-3 py-1 rounded-full border ${typeColors[update.type]}`}>
                      {update.type.replace(/_/g, ' ')}
                    </span>
                    <span>By {update.createdBy}</span>
                    <span>•</span>
                    <span>{formatTime(update.createdAt)}</span>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedId === update.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-400"
                >
                  ⌄
                </motion.div>
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
                <p className="text-gray-700 leading-relaxed">
                  {update.content}
                </p>
              </motion.div>

              {/* Attachments */}
              {expandedId === update.id && update.attachments && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-900 mb-2">Attachments</p>
                  <div className="flex gap-2">
                    {update.attachments.map((file) => (
                      <button
                        key={file}
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 transition-colors"
                      >
                        📎 {file}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
