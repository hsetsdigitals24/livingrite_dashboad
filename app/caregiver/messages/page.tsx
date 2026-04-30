'use client';

import { useState } from 'react';
import { ConversationListCaregiver } from '../components/ConversationListCaregiver';
import { ArrowLeft } from 'lucide-react';

export default function CaregiverMessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-2 px-4">
            <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-blue-800 mb-4 inline-block flex items-center gap-1"
            >
               <ArrowLeft className="w-4 h-4 inline mr-2" /> Back
            </button>
        </div>
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
        
        <div className="bg-white rounded-lg shadow">
          <ConversationListCaregiver />
        </div>
      </div>
    </div>
  );
}
