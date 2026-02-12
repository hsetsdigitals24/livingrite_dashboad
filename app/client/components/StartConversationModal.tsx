'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Caregiver {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
}

export function StartConversationModal({ 
  isOpen, 
  onClose, 
  patientId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  patientId: string;
}) {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaregiver, setSelectedCaregiver] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchCaregivers = async () => {
      try {
        const res = await fetch(`/api/client/messages/caregivers/${patientId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch caregivers');
        }
        const data = await res.json();
        console.log('Fetched caregivers:', data);
        setCaregivers(data);
      } catch (error) {
        console.error('Failed to fetch caregivers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregivers();
  }, [isOpen, patientId]);

  const handleStartConversation = async () => {
    if (!selectedCaregiver) return;

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caregiverId: selectedCaregiver,
          patientId,
          content: 'Hi, I would like to connect with you.',
        }),
      });

      if (res.ok) {
        const { conversationId } = await res.json();
        // Navigate to conversation or refresh list
        window.location.href = `/client/messages/${conversationId}`;
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Start New Conversation</h2>
        
        {loading ? (
          <p>Loading caregivers...</p>
        ) : caregivers.length === 0 ? (
          <p className="text-gray-500">No caregivers assigned to this patient.</p>
        ) : (
          <div className="space-y-3 my-4">
            {caregivers.map((caregiver) => (
              <button
                key={caregiver.id}
                onClick={() => setSelectedCaregiver(caregiver.id)}
                className={`w-full text-left p-3 border rounded-lg transition ${
                  selectedCaregiver === caregiver.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium">{caregiver.name}</p>
                <p className="text-sm text-gray-500">{caregiver.specialty}</p>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 my-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleStartConversation}
            disabled={!selectedCaregiver}
            className="flex-1"
          >
            Start Conversation
          </Button>
        </div>
      </div>
    </div>
  );
}