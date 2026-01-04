'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface HealthLog {
  date: string;
  bloodPressure: string;
  heartRate: number;
  temperature: string;
  weight: string;
  mood: string;
  sleepHours: number;
  notes: string;
}

const mockHealthLogs: HealthLog[] = [
  {
    date: 'Monday',
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: '98.6°F',
    weight: '165 lbs',
    mood: '😊 Good',
    sleepHours: 7.5,
    notes: 'Feeling energetic',
  },
  {
    date: 'Tuesday',
    bloodPressure: '118/78',
    heartRate: 70,
    temperature: '98.5°F',
    weight: '165 lbs',
    mood: '😊 Good',
    sleepHours: 8,
    notes: 'Great day',
  },
  {
    date: 'Wednesday',
    bloodPressure: '122/82',
    heartRate: 75,
    temperature: '98.7°F',
    weight: '165.5 lbs',
    mood: '😐 Neutral',
    sleepHours: 7,
    notes: 'A bit tired',
  },
  {
    date: 'Thursday',
    bloodPressure: '121/80',
    heartRate: 73,
    temperature: '98.6°F',
    weight: '165 lbs',
    mood: '😊 Good',
    sleepHours: 7.5,
    notes: 'Better',
  },
  {
    date: 'Friday',
    bloodPressure: '119/79',
    heartRate: 71,
    temperature: '98.5°F',
    weight: '164.5 lbs',
    mood: '😊 Good',
    sleepHours: 8,
    notes: 'Feeling great',
  },
  {
    date: 'Saturday',
    bloodPressure: '120/81',
    heartRate: 72,
    temperature: '98.6°F',
    weight: '165 lbs',
    mood: '😊 Good',
    sleepHours: 8.5,
    notes: 'Relaxing day',
  },
  {
    date: 'Sunday',
    bloodPressure: '118/77',
    heartRate: 69,
    temperature: '98.4°F',
    weight: '164.8 lbs',
    mood: '😊 Good',
    sleepHours: 8,
    notes: 'Perfect week',
  },
];

export default function HealthPage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Weekly Health Logs</h1>
        <p className="text-gray-600 mb-8">Track your vital signs and wellness</p>
      </motion.div>

      {/* Vital Signs Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Avg Heart Rate', value: '72', unit: 'bpm', color: 'bg-red-100 text-red-600' },
          { label: 'Avg BP', value: '120/80', unit: 'mmHg', color: 'bg-blue-100 text-blue-600' },
          { label: 'Avg Weight', value: '165', unit: 'lbs', color: 'bg-green-100 text-green-600' },
          { label: 'Avg Sleep', value: '7.8', unit: 'hrs', color: 'bg-purple-100 text-purple-600' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className={`${stat.color} rounded-lg p-6 transition-transform hover:scale-105 duration-300`}
          >
            <p className="text-sm opacity-75 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm opacity-75">{stat.unit}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Daily Logs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3"
      >
        {mockHealthLogs.map((log, idx) => (
          <motion.div
            key={log.date}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            onClick={() => setSelectedDay(selectedDay === log.date ? null : log.date)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <h3 className="font-semibold text-gray-900 mb-3">{log.date}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">BP</span>
                <span className="font-medium">{log.bloodPressure}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">HR</span>
                <span className="font-medium">{log.heartRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mood</span>
                <span>{log.mood}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sleep</span>
                <span className="font-medium">{log.sleepHours}h</span>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedDay === log.date && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Temperature</p>
                    <p className="font-medium">{log.temperature}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Weight</p>
                    <p className="font-medium">{log.weight}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Notes</p>
                    <p className="text-gray-700 mt-1">{log.notes}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
