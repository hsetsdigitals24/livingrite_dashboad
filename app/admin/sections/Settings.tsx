'use client';

import { useState } from 'react'; 
import PopupSettingsPage from './Settings/Popup';
import CodesSection from './Settings/Codes';
import ServicesSection from './Settings/Services';


type Tab = 'services' | 'codes' | 'popups';


export default function SettingsSection() {
  const [activeTab, setActiveTab] = useState<Tab>('services');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
   
 
  return (
    
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-1">Manage services and invitation codes</p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-600 hover:text-red-800 font-medium"
            >
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {successMessage}
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-2 text-green-600 hover:text-green-800 font-medium"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'services'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('codes')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'codes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Invitation Codes
            </button>
            <button
              onClick={() => setActiveTab('popups')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'popups'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Landing Page Popups
            </button>
          </div>
        </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
       <ServicesSection />
      )}

      {/* Invitation Codes Tab */}
      {activeTab === 'codes' && (
      <CodesSection />
      )}

      {/* Popups Tab */}
      {activeTab === 'popups' && (
       <PopupSettingsPage />
      )}
  
    </div>
  );
}