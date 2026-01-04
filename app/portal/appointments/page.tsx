'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Appointment {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  provider: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Annual Checkup',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: '10:00 AM',
    location: 'Medical Center, Room 201',
    provider: 'Dr. Smith',
    type: 'General Checkup',
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Blood Work',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    time: '2:00 PM',
    location: 'Lab Center B',
    provider: 'Blood Work Clinic',
    type: 'Lab Work',
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Follow-up Consultation',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    time: '3:30 PM',
    location: 'Dr. Johnson Office',
    provider: 'Dr. Johnson',
    type: 'Follow-up',
    status: 'completed',
  },
];

const statusColors: Record<Appointment['status'], string> = {
  scheduled: 'bg-blue-100 text-blue-800 border-blue-300',
  completed: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
};

export default function AppointmentsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const now = new Date();
  const filteredAppointments = mockAppointments.filter((apt) => {
    if (filter === 'upcoming') return apt.date >= now;
    if (filter === 'past') return apt.date < now;
    return true;
  });

  const upcomingCount = mockAppointments.filter((apt) => apt.date >= now).length;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Appointments</h1>
        <p className="text-gray-600 mb-8">Manage your medical appointments and follow-ups</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">Upcoming Appointments</p>
            <p className="text-4xl font-bold text-blue-600">{upcomingCount}</p>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            + Schedule
          </button>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-8 flex gap-3"
      >
        {['all', 'upcoming', 'past'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              filter === f
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Appointments List */}
      <motion.div className="space-y-4">
        {filteredAppointments.map((apt, idx) => {
          const isUpcoming = apt.date >= now;

          return (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setExpandedId(expandedId === apt.id ? null : apt.id)}
              className={`bg-white rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden ${
                expandedId === apt.id
                  ? 'border-blue-400 shadow-lg'
                  : 'border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              <motion.div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {apt.title}
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-medium ${
                          statusColors[apt.status]
                        }`}
                      >
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                        {apt.type}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedId === apt.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 text-xl"
                  >
                    ⌄
                  </motion.div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-semibold text-gray-900">
                      {apt.date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at {apt.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Provider</p>
                    <p className="font-semibold text-gray-900">{apt.provider}</p>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === apt.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="pt-4 border-t border-gray-200 space-y-4"
                  >
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Location</p>
                      <p className="text-gray-900 flex items-center gap-2">
                        📍 {apt.location}
                      </p>
                    </div>

                    {isUpcoming && (
                      <div className="flex gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Reschedule
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredAppointments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No appointments found</p>
        </motion.div>
      )}
    </div>
  );
}
