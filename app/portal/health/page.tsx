'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface HealthLog {
  date: string;
  bloodPressure: string;
  heartRate: number;
  weight: number;
  temperature: number;
  mood: string;
  sleepHours: number;
  medications: string[];
  meals: { type: string; items: string }[];
  notes: string;
}

const mockLogs: HealthLog[] = [
  {
    date: 'Today',
    bloodPressure: '120/80',
    heartRate: 72,
    weight: 75.2,
    temperature: 98.6,
    mood: 'Great',
    sleepHours: 8,
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    meals: [
      { type: 'Breakfast', items: 'Oatmeal with berries, toast' },
      { type: 'Lunch', items: 'Grilled chicken, rice, vegetables' },
      { type: 'Dinner', items: 'Salmon, sweet potato, broccoli' },
    ],
    notes: 'Feeling well, no issues',
  },
  {
    date: 'Yesterday',
    bloodPressure: '118/78',
    heartRate: 70,
    weight: 75.0,
    temperature: 98.6,
    mood: 'Good',
    sleepHours: 7.5,
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    meals: [
      { type: 'Breakfast', items: 'Toast with peanut butter' },
      { type: 'Lunch', items: 'Salad with chicken' },
      { type: 'Dinner', items: 'Pasta with light sauce' },
    ],
    notes: 'Slight headache in the afternoon',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HealthPage() {
  const [selectedLog, setSelectedLog] = useState<HealthLog | null>(mockLogs[0]);
  const [expandedSection, setExpandedSection] = useState<string | null>('vitals');

  const VitalCard = ({ label, value, unit, icon, color }: any) => (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg`}
    >
      <p className="text-sm opacity-90 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs opacity-75 mt-1">{unit}</p>
      <p className="text-2xl mt-4">{icon}</p>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Health Logs
        </h1>
        <p className="text-gray-600">Track your weekly health metrics and wellness data</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar - Date Selection */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Select Date</h3>
            </div>
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {mockLogs.map((log, idx) => (
                <motion.button
                  key={log.date}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedLog(log)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    selectedLog?.date === log.date
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="font-medium">{log.date}</p>
                  <p className={`text-xs ${selectedLog?.date === log.date ? 'opacity-80' : 'text-gray-500'}`}>
                    Mood: {log.mood}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        {selectedLog && (
          <motion.div
            key={selectedLog.date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Vital Signs */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <button
                onClick={() => setExpandedSection(expandedSection === 'vitals' ? null : 'vitals')}
                className="w-full flex items-center justify-between mb-4 hover:opacity-70 transition-opacity"
              >
                <h2 className="text-2xl font-bold text-gray-900">Vital Signs</h2>
                <motion.span animate={{ rotate: expandedSection === 'vitals' ? 180 : 0 }}>
                  ⌄
                </motion.span>
              </button>

              {expandedSection === 'vitals' && (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <VitalCard
                    label="Blood Pressure"
                    value={selectedLog.bloodPressure}
                    unit="mmHg"
                    icon="💓"
                    color="from-blue-500 to-cyan-500"
                  />
                  <VitalCard
                    label="Heart Rate"
                    value={selectedLog.heartRate}
                    unit="bpm"
                    icon="❤️"
                    color="from-red-500 to-pink-500"
                  />
                  <VitalCard
                    label="Weight"
                    value={selectedLog.weight}
                    unit="kg"
                    icon="⚖️"
                    color="from-yellow-500 to-orange-500"
                  />
                  <VitalCard
                    label="Temperature"
                    value={selectedLog.temperature}
                    unit="°F"
                    icon="🌡️"
                    color="from-purple-500 to-pink-500"
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Wellness Data */}
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
              {/* Mood & Sleep */}
              <motion.div variants={item} className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                  <p className="text-sm text-amber-700 mb-2">Mood</p>
                  <p className="text-3xl font-bold text-amber-900">{selectedLog.mood} 😊</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 shadow-sm">
                  <p className="text-sm text-indigo-700 mb-2">Sleep Duration</p>
                  <p className="text-3xl font-bold text-indigo-900">{selectedLog.sleepHours}h</p>
                </div>
              </motion.div>

              {/* Medications */}
              <motion.div
                variants={item}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 mb-4">Medications Taken</h3>
                <div className="space-y-2">
                  {selectedLog.medications.map((med) => (
                    <motion.div
                      key={med}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100"
                    >
                      <span className="text-xl">💊</span>
                      <span className="text-gray-900 font-medium">{med}</span>
                      <span className="ml-auto text-green-600 font-semibold">✓</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Meals */}
              <motion.div
                variants={item}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 mb-4">Daily Meals</h3>
                <div className="space-y-3">
                  {selectedLog.meals.map((meal, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 4 }}
                      className="border-l-4 border-green-500 pl-4 py-2"
                    >
                      <p className="font-semibold text-gray-900">{meal.type}</p>
                      <p className="text-gray-600 text-sm">{meal.items}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Notes */}
              {selectedLog.notes && (
                <motion.div
                  variants={item}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm"
                >
                  <h3 className="font-bold text-green-900 mb-2">Notes</h3>
                  <p className="text-green-800">{selectedLog.notes}</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

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
