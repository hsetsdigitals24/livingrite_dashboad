'use client';

import { useState } from 'react';
import PopupSettingsPage from './Settings/Popup';
import CodesSection from './Settings/Codes';
import ServicesSection from './Settings/Services';
import SMSRemindersSettings from './Settings/SMSReminders';
import PaymentSettingsSection from './Settings/PaymentSettings';

type Tab = 'services' | 'codes' | 'popups' | 'sms-reminders' | 'payment';

const TABS: { id: Tab; label: string }[] = [
  { id: 'services', label: 'Services' },
  { id: 'codes', label: 'Invitation Codes' },
  { id: 'popups', label: 'Landing Page Popups' },
  { id: 'sms-reminders', label: 'SMS Reminders' },
  { id: 'payment', label: 'Payment Settings' },
];

export default function SettingsSection() {
  const [activeTab, setActiveTab] = useState<Tab>('services');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage services, codes, and platform configuration</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 font-medium border-b-2 transition-colors text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'services' && <ServicesSection />}
      {activeTab === 'codes' && <CodesSection />}
      {activeTab === 'popups' && <PopupSettingsPage />}
      {activeTab === 'sms-reminders' && <SMSRemindersSettings />}
      {activeTab === 'payment' && <PaymentSettingsSection />}
    </div>
  );
}
