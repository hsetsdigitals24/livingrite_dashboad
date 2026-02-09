'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, AlertCircle } from 'lucide-react';

interface Caregiver {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  caregiverProfile?: {
    specialization?: string[];
    yearsOfExperience?: number;
  };
}

interface AssignCaregiverModalProps {
  patientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignCaregiverModal({
  patientId,
  onClose,
  onSuccess,
}: AssignCaregiverModalProps) {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');
  const [selectedCaregiverId, setSelectedCaregiverId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/admin/caregivers');

      if (!response.ok) {
        throw new Error('Failed to fetch caregivers');
      }

      const data = await response.json();
      setCaregivers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load caregivers');
      console.error('Error fetching caregivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedCaregiverId) {
      setError('Please select a caregiver');
      return;
    }

    try {
      setAssigning(true);
      setError('');

      const response = await fetch(
        `/api/admin/patients/${patientId}/assign-caregiver`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caregiverId: selectedCaregiverId,
            notes: notes || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign caregiver');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error assigning caregiver:', err);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold">Assign Caregiver</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500">Loading caregivers...</p>
          ) : caregivers.length === 0 ? (
            <p className="text-center text-gray-500">No caregivers available</p>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Caregiver
                </label>
                <select
                  value={selectedCaregiverId}
                  onChange={(e) => setSelectedCaregiverId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Choose a Caregiver --</option>
                  {caregivers.map((caregiver) => (
                    <option key={caregiver.id} value={caregiver.id}>
                      {caregiver.name || caregiver.email}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCaregiverId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  {caregivers
                    .filter((c) => c.id === selectedCaregiverId)
                    .map((caregiver) => (
                      <div key={caregiver.id}>
                        <p className="font-medium text-gray-900">
                          {caregiver.name || 'No name'}
                        </p>
                        <p className="text-sm text-gray-600">{caregiver.email}</p>
                        {caregiver.phone && (
                          <p className="text-sm text-gray-600">{caregiver.phone}</p>
                        )}
                        {caregiver.caregiverProfile?.specialization && (
                          <p className="text-xs text-gray-500 mt-2">
                            Specialization:{' '}
                            {caregiver.caregiverProfile.specialization.join(
                              ', '
                            )}
                          </p>
                        )}
                        {caregiver.caregiverProfile?.yearsOfExperience && (
                          <p className="text-xs text-gray-500">
                            Experience:{' '}
                            {caregiver.caregiverProfile.yearsOfExperience} years
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions or notes for this assignment..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={assigning}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssign}
                  disabled={!selectedCaregiverId || assigning}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {assigning ? 'Assigning...' : 'Assign'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
