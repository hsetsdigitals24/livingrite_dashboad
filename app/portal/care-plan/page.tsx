'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CarePlan {
  title: string;
  description: string;
  goals: Array<{
    id: string;
    goal: string;
    targetDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
  }>;
  schedule: Array<{
    day: string;
    activities: Array<{
      time: string;
      activity: string;
      assignedTo: string;
    }>;
  }>;
}

const mockCarePlan: CarePlan = {
  title: 'Personal Care Plan - Q1 2024',
  description:
    'Comprehensive care plan focused on health maintenance and wellness improvement',
  goals: [
    {
      id: '1',
      goal: 'Maintain stable blood pressure',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: 'in_progress',
    },
    {
      id: '2',
      goal: 'Complete annual physical exam',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'pending',
    },
    {
      id: '3',
      goal: 'Increase daily activity to 30 minutes',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'in_progress',
    },
    {
      id: '4',
      goal: 'Improve sleep quality',
      targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'pending',
    },
  ],
  schedule: [
    {
      day: 'Monday',
      activities: [
        { time: '8:00 AM', activity: 'Breakfast & Medications', assignedTo: 'Self' },
        { time: '9:30 AM', activity: 'Physical Therapy', assignedTo: 'Sarah Johnson' },
        { time: '2:00 PM', activity: 'Meal Prep', assignedTo: 'Sarah Johnson' },
      ],
    },
    {
      day: 'Tuesday',
      activities: [
        { time: '8:00 AM', activity: 'Breakfast & Medications', assignedTo: 'Self' },
        { time: '10:00 AM', activity: 'Walking Session', assignedTo: 'Self' },
        { time: '3:00 PM', activity: 'Nurse Check-in', assignedTo: 'Jennifer Lee' },
      ],
    },
    {
      day: 'Wednesday',
      activities: [
        { time: '8:00 AM', activity: 'Breakfast & Medications', assignedTo: 'Self' },
        { time: '2:00 PM', activity: 'Health Monitoring', assignedTo: 'Sarah Johnson' },
      ],
    },
    {
      day: 'Thursday',
      activities: [
        { time: '8:00 AM', activity: 'Breakfast & Medications', assignedTo: 'Self' },
        { time: '9:30 AM', activity: 'Physical Therapy', assignedTo: 'Sarah Johnson' },
      ],
    },
    {
      day: 'Friday',
      activities: [
        { time: '8:00 AM', activity: 'Breakfast & Medications', assignedTo: 'Self' },
        { time: '10:00 AM', activity: 'Doctor Consultation', assignedTo: 'Dr. Smith' },
      ],
    },
  ],
};

const statusColors: Record<CarePlan['goals'][0]['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
  completed: 'bg-green-100 text-green-800 border-green-300',
};

export default function CarePlanPage() {
  const [expandedDay, setExpandedDay] = useState<string | null>('Monday');

  const completedGoals = mockCarePlan.goals.filter(g => g.status === 'completed').length;
  const totalGoals = mockCarePlan.goals.length;

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Care Plan</h1>
        <p className="text-gray-600 mb-8">{mockCarePlan.title}</p>
      </motion.div>

      {/* Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6"
      >
        <p className="text-gray-700 mb-6">{mockCarePlan.description}</p>
        <div className="flex items-center gap-8">
          <div>
            <p className="text-sm text-gray-600 mb-2">Goals Progress</p>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-blue-600">{completedGoals}</p>
              <p className="text-gray-600 mb-1">/ {totalGoals} completed</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedGoals / totalGoals) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-blue-600 h-full rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Goals Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Care Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCarePlan.goals.map((goal, idx) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex-1">{goal.goal}</h3>
                <span
                  className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap ml-2 ${
                    statusColors[goal.status]
                  }`}
                >
                  {goal.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Target: {goal.targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              {goal.status === 'in_progress' && (
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-blue-600"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Schedule */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Schedule</h2>

        {/* Day Selector */}
        <div className="mb-6 flex overflow-x-auto gap-2 pb-2">
          {mockCarePlan.schedule.map((daySchedule) => (
            <motion.button
              key={daySchedule.day}
              onClick={() => setExpandedDay(expandedDay === daySchedule.day ? null : daySchedule.day)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                expandedDay === daySchedule.day
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
              }`}
            >
              {daySchedule.day}
            </motion.button>
          ))}
        </div>

        {/* Activities for Selected Day */}
        {expandedDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Activities for {expandedDay}
            </h3>

            <div className="space-y-4">
              {mockCarePlan.schedule
                .find((s) => s.day === expandedDay)
                ?.activities.map((activity, idx) => (
                  <motion.div
                    key={`${expandedDay}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                  >
                    <div className="min-w-fit">
                      <p className="text-xl font-bold text-blue-600">{activity.time}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {activity.activity}
                      </h4>
                      <p className="text-sm text-gray-600">
                        👤 {activity.assignedTo}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
