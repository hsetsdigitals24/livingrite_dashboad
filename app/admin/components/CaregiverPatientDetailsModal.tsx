'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { X, AlertCircle, Calendar, Heart, FileText, Stethoscope } from 'lucide-react';

interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  biologicalGender?: string;
  heightCm?: number;
  weightKg?: number;
  timezone?: string;
  medicalConditions?: string[];
  medications?: any;
  emergencyContact?: string;
  emergencyPhone?: string;
  vitals: Array<{
    id: string;
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    recordedAt: string;
  }>;
  dailyLogs: Array<{
    id: string;
    date: string;
  }>;
  labResults: Array<{
    id: string;
    date: string;
    testResults: any;
  }>;
  medicalAppointments: Array<{
    id: string;
    date: string;
    provider: string;
    reason: string;
  }>;
  bookings: Array<{
    id: string;
    scheduledAt: string;
    status: string;
    eventTitle?: string;
  }>;
  caregivers: Array<{
    id: string;
    assignedAt: string;
    notes?: string;
  }>;
}

interface CaregiverPatientDetailsModalProps {
  patientId: string;
  onClose: () => void;
}

export default function CaregiverPatientDetailsModal({
  patientId,
  onClose,
}: CaregiverPatientDetailsModalProps) {
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'vitals' | 'logs' | 'appointments'
  >('overview');

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/caregiver/patients/${patientId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch patient details');
      }

      const data = await response.json();
      setPatient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching patient details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4 p-8">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4 p-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error || 'Patient not found'}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8">
        {/* Header */}
        <div className="border-b p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b flex gap-1 px-6 pt-4">
          {[
            { id: 'overview', label: 'Overview', icon: Heart },
            { id: 'vitals', label: 'Latest Vitals', icon: Heart },
            { id: 'logs', label: 'Daily Logs', icon: FileText },
            { id: 'appointments', label: 'Medical', icon: Stethoscope },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    First Name
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {patient.firstName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Last Name
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {patient.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {patient.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {patient.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Date of Birth
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {patient.dateOfBirth
                      ? new Date(patient.dateOfBirth).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Gender
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1 capitalize">
                    {patient.biologicalGender || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Height
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {patient.heightCm ? `${patient.heightCm} cm` : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Weight
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {patient.weightKg ? `${patient.weightKg} kg` : 'N/A'}
                  </p>
                </div>
              </div>

              {patient.medicalConditions && patient.medicalConditions.length > 0 && (
                <div className="mb-6">
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-3">
                    Medical Conditions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {patient.medicalConditions.map((condition, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {patient.emergencyContact && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">
                        Name
                      </label>
                      <p className="text-gray-900 font-medium mt-1">
                        {patient.emergencyContact}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">
                        Phone
                      </label>
                      <p className="text-gray-900 font-medium mt-1">
                        {patient.emergencyPhone || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vitals Tab */}
          {activeTab === 'vitals' && (
            <div>
              {patient.vitals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No vital records found
                </div>
              ) : (
                <div className="space-y-4">
                  {patient.vitals.map((vital) => (
                    <div key={vital.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Temperature
                          </p>
                          <p className="text-lg font-medium text-gray-900 mt-1">
                            {vital.temperature}°C
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Blood Pressure
                          </p>
                          <p className="text-lg font-medium text-gray-900 mt-1">
                            {vital.bloodPressure}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Heart Rate
                          </p>
                          <p className="text-lg font-medium text-gray-900 mt-1">
                            {vital.heartRate} bpm
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Recorded
                          </p>
                          <p className="text-lg font-medium text-gray-900 mt-1">
                            {new Date(vital.recordedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Daily Logs Tab */}
          {activeTab === 'logs' && (
            <div>
              {patient.dailyLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No daily logs found
                </div>
              ) : (
                <div className="space-y-2">
                  {patient.dailyLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(log.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Medical Appointments Tab */}
          {activeTab === 'appointments' && (
            <div>
              {patient.medicalAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No medical appointments found
                </div>
              ) : (
                <div className="space-y-4">
                  {patient.medicalAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4 hover:border-blue-300 transition"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Date
                          </p>
                          <p className="text-gray-900 font-medium mt-1">
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Provider
                          </p>
                          <p className="text-gray-900 font-medium mt-1">
                            {appointment.provider}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Reason
                          </p>
                          <p className="text-gray-900 font-medium mt-1">
                            {appointment.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Close
          </button>
        </div>
      </Card>
    </div>
  );
}
