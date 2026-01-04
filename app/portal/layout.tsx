'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { href: '/portal/updates', label: 'Care Updates', icon: '📋' },
    { href: '/portal/health', label: 'Health Logs', icon: '❤️' },
    { href: '/portal/documents', label: 'Documents', icon: '📄' },
    { href: '/portal/messaging', label: 'Messages', icon: '💬' },
    { href: '/portal/appointments', label: 'Appointments', icon: '📅' },
    { href: '/portal/care-plan', label: 'Care Plan', icon: '📊' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-xl z-40 overflow-y-auto"
      >
        <div className="p-6 border-b border-blue-500">
          <h1 className="text-2xl font-bold">LivingRite</h1>
          <p className="text-blue-100 text-sm mt-1">Care Portal</p>
        </div>

        <nav className="p-6 space-y-2">
          {navItems.map((item, idx) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-500 hover:translate-x-1"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <motion.header
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-30"
        >
          <div className="px-8 py-4 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ☰
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Family Member</p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8 overflow-y-auto h-[calc(100vh-80px)]"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
