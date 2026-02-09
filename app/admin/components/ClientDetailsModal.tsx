'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { X, AlertCircle, Calendar, Users, CreditCard, Globe } from 'lucide-react';

interface ClientDetails {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  emailVerified?: string;
  createdAt: string;
  updatedAt: string;
  familyMemberAssignments: Array<{
    id: string;
    relationshipType: string;
    accessLevel: string;
    assignedAt: string;
    patient: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
      dateOfBirth?: string;
      biologicalGender?: string;
      medicalConditions?: string[];
    };
  }>;
  bookings: Array<{
    id: string;
    calcomId: string;
    scheduledAt: string;
    status: string;
    eventTitle?: string;
    clientName: string;
    service?: {
      id: string;
      title: string;
      basePrice?: number;
      currency: string;
    };
    payment?: {
      id: string;
      status: string;
      amount: number;
      paidAt: string;
    };
    patient?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
  accounts: Array<{
    provider: string;
    type: string;
  }>;
  sessions: Array<{
    expires: string;
  }>;
}

interface ClientDetailsModalProps {
  clientId: string;
  onClose: () => void;
}

export default function ClientDetailsModal({
  clientId,
  onClose,
}: ClientDetailsModalProps) {
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'family' | 'bookings' | 'account'
  >('overview');

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/admin/clients/${clientId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch client details');
      }

      const data = await response.json();
      setClient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching client details:', err);
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

  if (error || !client) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4 p-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error || 'Client not found'}</p>
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
            <h2 className="text-2xl font-bold text-gray-900">Client Details</h2>
            <p className="text-sm text-gray-600 mt-1">{client.email}</p>
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
            { id: 'overview', label: 'Overview', icon: Globe },
            { id: 'family', label: 'Family Members', icon: Users },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'account', label: 'Account', icon: CreditCard },
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Full Name
                </label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {client.name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Email
                </label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {client.email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Phone
                </label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {client.phone || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Email Verified
                </label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {client.emailVerified ? 'Yes' : 'Not verified'}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Member Since
                </label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {new Date(client.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Total Family Members
                </label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {client.familyMemberAssignments.length}
                </p>
              </div>
            </div>
          )}

          {/* Family Members Tab */}
          {activeTab === 'family' && (
            <div>
              {client.familyMemberAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No family members assigned
                </div>
              ) : (
                <div className="space-y-4">
                  {client.familyMemberAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="border rounded-lg p-4 hover:border-blue-300 transition"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Name
                          </p>
                          <p className="text-gray-900 font-medium mt-1">
                            {assignment.patient.firstName}{' '}
                            {assignment.patient.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Relationship
                          </p>
                          <p className="text-gray-900 font-medium mt-1 capitalize">
                            {assignment.relationshipType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Access Level
                          </p>
                          <p className="text-gray-900 font-medium mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                assignment.accessLevel === 'FULL_ACCESS'
                                  ? 'bg-green-100 text-green-800'
                                  : assignment.accessLevel === 'EDIT'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {assignment.accessLevel}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Assigned Date
                          </p>
                          <p className="text-gray-900 font-medium mt-1">
                            {new Date(assignment.assignedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              {client.bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No bookings found
                </div>
              ) : (
                <div className="space-y-4">
                  {client.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border rounded-lg p-4 hover:border-blue-300 transition"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Service
                          </p>
                          <p className="text-gray-900 font-medium mt-1">
                            {booking.service?.title || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Scheduled
                          </p>
                          <p className="text-gray-900 font-medium mt-1">
                            {new Date(booking.scheduledAt).toLocaleDateString()}{' '}
                            {new Date(booking.scheduledAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Status
                          </p>
                          <p className="text-gray-900 font-medium mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                booking.status === 'COMPLETED'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-800'
                                    : booking.status === 'SCHEDULED'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Amount
                          </p>
                          <p className="text-gray-900 font-medium mt-1">
                            {booking.payment?.amount
                              ? `${booking.service?.currency || 'NGN'} ${booking.payment.amount}`
                              : 'N/A'}
                          </p>
                        </div>
                        {booking.patient && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">
                              Patient
                            </p>
                            <p className="text-gray-900 font-medium mt-1">
                              {booking.patient.firstName} {booking.patient.lastName}
                            </p>
                          </div>
                        )}
                        {booking.payment && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">
                              Payment Status
                            </p>
                            <p className="text-gray-900 font-medium mt-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  booking.payment.status === 'PAID'
                                    ? 'bg-green-100 text-green-800'
                                    : booking.payment.status === 'PENDING'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {booking.payment.status}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Connected Accounts
                </h3>
                {client.accounts.length === 0 ? (
                  <p className="text-gray-500">No connected accounts</p>
                ) : (
                  <div className="space-y-2">
                    {client.accounts.map((account, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {account.provider.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {account.provider}
                          </p>
                          <p className="text-xs text-gray-500">{account.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Active Sessions
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Total active sessions: {client.sessions.length}
                </p>
                {client.sessions.length === 0 ? (
                  <p className="text-gray-500">No active sessions</p>
                ) : (
                  <div className="space-y-2">
                    {client.sessions.map((session, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Session {idx + 1}</p>
                          <p className="text-xs text-gray-500">
                            Expires: {new Date(session.expires).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
