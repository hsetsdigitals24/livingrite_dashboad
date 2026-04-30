'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Client {
  id: string;
  clientName: string;
  clientEmail: string;
  scheduledAt: string;
  status: string;
}

interface ProgressReport {
  clientId: string;
  clientName: string;
  progressNotes: string;
  isUrgent: boolean;
  vitalSystolic?: number;
  vitalDiastolic?: number;
  vitalTemperature?: number;
  attachmentUrl?: string;
}

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const [formData, setFormData] = useState<ProgressReport>({
    clientId: '',
    clientName: '',
    progressNotes: '',
    isUrgent: false,
  });

  useEffect(() => {
    if (
      status === 'unauthenticated' ||
      (session?.user?.role !== 'CAREGIVER' && session?.user?.role !== 'ADMIN')
    ) {
      router.push('/dashboard');
      return;
    }

    fetchClients();
  }, [status, session, router]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Fetch bookings for this caregiver's clients
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        // Filter only scheduled/completed bookings
        const activeClients = data.filter(
          (booking: any) =>
            booking.status === 'SCHEDULED' || booking.status === 'COMPLETED'
        );
        setClients(activeClients);
      } else {
        setError('Failed to load clients');
      }
    } catch (err) {
      setError('Error loading clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setSelectedClient(clientId);
      setFormData({
        ...formData,
        clientId: client.id,
        clientName: client.clientName,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === 'vitalSystolic' || name === 'vitalDiastolic' || name === 'vitalTemperature') {
      setFormData({
        ...formData,
        [name]: value ? parseFloat(value) : undefined,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedClient || !formData.progressNotes.trim()) {
      setError('Please select a client and enter progress notes');
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('clientId', formData.clientId);
      formDataToSend.append('clientName', formData.clientName);
      formDataToSend.append('progressNotes', formData.progressNotes);
      formDataToSend.append('isUrgent', formData.isUrgent.toString());

      if (formData.vitalSystolic) {
        formDataToSend.append('vitalSystolic', formData.vitalSystolic.toString());
      }
      if (formData.vitalDiastolic) {
        formDataToSend.append('vitalDiastolic', formData.vitalDiastolic.toString());
      }
      if (formData.vitalTemperature) {
        formDataToSend.append('vitalTemperature', formData.vitalTemperature.toString());
      }
      if (attachment) {
        formDataToSend.append('attachment', attachment);
      }

      const response = await fetch('/api/caregiver/reports', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccess('Progress report submitted successfully!');
        // Reset form
        setFormData({
          clientId: '',
          clientName: '',
          progressNotes: '',
          isUrgent: false,
        });
        setSelectedClient('');
        setAttachment(null);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit report');
      }
    } catch (err) {
      setError('Error submitting report');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <p className="ml-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/caregiver" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Reports</h1>
          <p className="text-gray-600 mb-8">
            Submit progress updates, vital signs, and documentation for your assigned clients
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Client <span className="text-red-500">*</span>
              </label>
              {clients.length === 0 ? (
                <p className="text-gray-600 text-sm">
                  No active clients found. Check back later or contact your administrator.
                </p>
              ) : (
                <div className="space-y-2">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center">
                      <input
                        type="radio"
                        id={client.id}
                        name="client"
                        value={client.id}
                        checked={selectedClient === client.id}
                        onChange={(e) => handleClientSelect(e.target.value)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label
                        htmlFor={client.id}
                        className="ml-3 flex-1 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
                      >
                        <p className="font-medium text-gray-900">{client.clientName}</p>
                        <p className="text-sm text-gray-500">{client.clientEmail}</p>
                        <p className="text-xs text-gray-400">
                          Scheduled: {new Date(client.scheduledAt).toLocaleDateString()}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Progress Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                name="progressNotes"
                value={formData.progressNotes}
                onChange={handleInputChange}
                placeholder="Document client observations, improvements, challenges, and recommendations..."
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Include observations, health updates, behavioral changes, and any recommendations.
              </p>
            </div>

            {/* Vital Signs */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs (Optional)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Systolic (mmHg)
                  </label>
                  <input
                    type="number"
                    name="vitalSystolic"
                    value={formData.vitalSystolic || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 120"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diastolic (mmHg)
                  </label>
                  <input
                    type="number"
                    name="vitalDiastolic"
                    value={formData.vitalDiastolic || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 80"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="vitalTemperature"
                    value={formData.vitalTemperature || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 37"
                    step="0.1"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Attach Document or Photo (Optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, Images (JPG, PNG) up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    name="attachment"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              {attachment && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {attachment.name} selected
                </p>
              )}
            </div>

            {/* Urgent Flag */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600"
                />
                <span className="ml-3 text-sm font-semibold text-red-900">
                  🚨 Flag as Urgent - Notify family immediately
                </span>
              </label>
              <p className="text-xs text-red-700 mt-2 ml-7">
                Only use this flag for critical updates that require immediate family attention
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || clients.length === 0}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Submitting...' : 'Submit Progress Report'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    clientId: '',
                    clientName: '',
                    progressNotes: '',
                    isUrgent: false,
                  });
                  setSelectedClient('');
                  setAttachment(null);
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Tips for Better Reports</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Be specific and detailed in your observations</li>
            <li>✓ Document dates and times of significant events</li>
            <li>✓ Include vital signs when measured</li>
            <li>✓ Attach relevant medical documents or test results</li>
            <li>✓ Only flag as urgent for critical health or safety concerns</li>
            <li>✓ Use professional language in all notes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
