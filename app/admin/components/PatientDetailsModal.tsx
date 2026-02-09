'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { X, AlertCircle, Calendar, Heart, FileText, Stethoscope, BookOpen } from 'lucide-react';
import AssignCaregiverModal from './AssignCaregiverModal';

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
  caregivers: Array<{
    id: string;
    caregiverId: string;
    notes?: string;
    caregiver: {
      id: string;
      name?: string;
      email?: string;
      phone?: string;
      caregiverProfile?: {
        specialization?: string[];
        yearsOfExperience?: number;
        bio?: string;
      };
    };
  }>;
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
    sleepData?: any;
    morningVitals?: any;
    eveningVitals?: any;
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
}

interface PatientDetailsModalProps {
  patientId: string;
  onClose: () => void;
}

export default function PatientDetailsModal({
  patientId,
  onClose,
}: PatientDetailsModalProps) {
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'vitals' | 'logs' | 'appointments' | 'caregivers'
  >('overview');
  const [showAssignCaregiverModal, setShowAssignCaregiverModal] = useState(false);

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/admin/patients/${patientId}`);

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
        <Card className="w-full max-w-4xl p-8 text-center">
          <p className="text-gray-600">Loading patient details...</p>
        </Card>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">Patient Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error || 'Failed to load patient'}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const age = patient.dateOfBirth
    ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
    : '-';

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-sm text-gray-600">{patient.email || 'No email'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Info */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600">Age</p>
              <p className="text-lg font-semibold">{age}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Phone</p>
              <p className="text-lg font-semibold">{patient.phone || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Gender</p>
              <p className="text-lg font-semibold capitalize">
                {patient.biologicalGender || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Height/Weight</p>
              <p className="text-lg font-semibold">
                {patient.heightCm ? `${patient.heightCm}cm` : '-'} / {patient.weightKg ? `${patient.weightKg}kg` : '-'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-8">
              {(
                [
                  { id: 'overview', label: 'Overview', icon: FileText },
                  { id: 'vitals', label: 'Vitals', icon: Heart },
                  { id: 'logs', label: 'Daily Logs', icon: BookOpen },
                  { id: 'appointments', label: 'Appointments', icon: Stethoscope },
                  { id: 'caregivers', label: 'Caregivers', icon: Calendar },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-4 py-4 font-medium border-b-2 transition ${
                    activeTab === id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Medical Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Medical Conditions</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {patient.medicalConditions && patient.medicalConditions.length > 0 ? (
                          patient.medicalConditions.map((condition, idx) => (
                            <span
                              key={idx}
                              className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs"
                            >
                              {condition}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">None recorded</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Timezone</p>
                      <p className="text-lg font-medium mt-2">{patient.timezone || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Contact Name</p>
                      <p className="text-lg font-medium mt-2">
                        {patient.emergencyContact || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact Phone</p>
                      <p className="text-lg font-medium mt-2">
                        {patient.emergencyPhone || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vitals Tab */}
            {activeTab === 'vitals' && (
              <div>
                {patient.vitals.length === 0 ? (
                  <p className="text-gray-500">No vital records found</p>
                ) : (
                  <div className="space-y-4">
                    {patient.vitals.map((vital) => (
                      <div
                        key={vital.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <p className="text-sm text-gray-600">
                          {new Date(vital.recordedAt).toLocaleString()}
                        </p>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-600">Temperature</p>
                            <p className="text-lg font-semibold">
                              {vital.temperature}°C
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Blood Pressure</p>
                            <p className="text-lg font-semibold">
                              {vital.bloodPressure}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Heart Rate</p>
                            <p className="text-lg font-semibold">
                              {vital.heartRate} bpm
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
                  <p className="text-gray-500">No daily logs found</p>
                ) : (
                  <div className="space-y-4">
                    {patient.dailyLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <p className="font-medium text-gray-900">
                          {new Date(log.date).toLocaleDateString()}
                        </p>
                        <div className="text-sm text-gray-600 mt-2">
                          {log.sleepData && (
                            <p>✓ Sleep data recorded</p>
                          )}
                          {log.morningVitals && (
                            <p>✓ Morning vitals recorded</p>
                          )}
                          {log.eveningVitals && (
                            <p>✓ Evening vitals recorded</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                {patient.medicalAppointments.length === 0 ? (
                  <p className="text-gray-500">No appointments found</p>
                ) : (
                  <div className="space-y-4">
                    {patient.medicalAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              {apt.provider}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {apt.reason}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(apt.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Caregivers Tab */}
            {activeTab === 'caregivers' && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowAssignCaregiverModal(true)}
                  className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  Assign Caregiver
                </button>

                {patient.caregivers.length === 0 ? (
                  <p className="text-gray-500">No caregivers assigned</p>
                ) : (
                  <div className="space-y-4">
                    {patient.caregivers.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {assignment.caregiver.name ||
                                assignment.caregiver.email}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {assignment.caregiver.email}
                            </p>
                            {assignment.caregiver.phone && (
                              <p className="text-sm text-gray-600">
                                {assignment.caregiver.phone}
                              </p>
                            )}
                            {assignment.caregiver.caregiverProfile?.specialization && (
                              <p className="text-xs text-gray-500 mt-2">
                                Specialization:{' '}
                                {assignment.caregiver.caregiverProfile.specialization.join(
                                  ', '
                                )}
                              </p>
                            )}
                            {assignment.notes && (
                              <p className="text-sm text-gray-700 mt-3 p-2 bg-gray-50 rounded">
                                {assignment.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Assign Caregiver Modal */}
      {showAssignCaregiverModal && (
        <AssignCaregiverModal
          patientId={patientId}
          onClose={() => setShowAssignCaregiverModal(false)}
          onSuccess={() => {
            setShowAssignCaregiverModal(false);
            fetchPatientDetails();
          }}
        />
      )}
    </>
  );
}
