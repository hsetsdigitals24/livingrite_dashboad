'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { X, AlertCircle, CheckCircle, Heart, FileText, Upload, Calendar } from 'lucide-react';

interface EditPatientFormProps {
  patientId: string;
  patientName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditPatientForm({
  patientId,
  patientName,
  onClose,
  onSuccess,
}: EditPatientFormProps) {
  const [activeTab, setActiveTab] = useState<
    'vitals' | 'daily-logs' | 'media'
  >('vitals');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Vitals form state
  const [vitals, setVitals] = useState({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
  });

  // Daily logs form state
  const [dailyLog, setDailyLog] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Media form state
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Handle vitals submission
  const handleVitalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!vitals.temperature || !vitals.bloodPressure || !vitals.heartRate) {
        setError('Please fill in all vital fields');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/caregiver/patients/${patientId}/vitals`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            temperature: parseFloat(vitals.temperature),
            bloodPressure: vitals.bloodPressure,
            heartRate: parseInt(vitals.heartRate),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save vitals');
      }

      setSuccess('Vitals recorded successfully!');
      setVitals({ temperature: '', bloodPressure: '', heartRate: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle daily log submission
  const handleDailyLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!dailyLog.date) {
        setError('Please select a date');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/caregiver/patients/${patientId}/daily-logs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: new Date(dailyLog.date),
            notes: dailyLog.notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save daily log');
      }

      setSuccess('Daily log recorded successfully!');
      setDailyLog({ date: new Date().toISOString().split('T')[0], notes: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle media file selection
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle media upload
  const handleMediaUpload = async () => {
    if (!mediaFile) {
      setError('Please select a file');
      return;
    }

    setUploadingMedia(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', mediaFile);

      const response = await fetch(
        `/api/files/${patientId}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload media');
      }

      setSuccess('Media uploaded successfully!');
      setMediaFile(null);
      setMediaPreview('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploadingMedia(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        {/* Header */}
        <div className="border-b p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Patient Data</h2>
            <p className="text-sm text-gray-600 mt-1">{patientName}</p>
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
        <div className="border-b flex gap-1 px-6 pt-4 overflow-x-auto">
          {[
            { id: 'vitals', label: 'Vitals', icon: Heart },
            { id: 'daily-logs', label: 'Daily Logs', icon: FileText },
            { id: 'media', label: 'Media', icon: Upload },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
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

        {/* Alert Messages */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Vitals Tab */}
          {activeTab === 'vitals' && (
            <form onSubmit={handleVitalsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="35"
                  max="42"
                  value={vitals.temperature}
                  onChange={(e) =>
                    setVitals({ ...vitals, temperature: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., 37.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure (e.g., 120/80)
                </label>
                <input
                  type="text"
                  value={vitals.bloodPressure}
                  onChange={(e) =>
                    setVitals({ ...vitals, bloodPressure: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., 120/80"
                  pattern="\d+/\d+"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={vitals.heartRate}
                  onChange={(e) =>
                    setVitals({ ...vitals, heartRate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., 72"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
                >
                  {loading ? 'Saving...' : 'Save Vitals'}
                </button>
              </div>
            </form>
          )}

          {/* Daily Logs Tab */}
          {activeTab === 'daily-logs' && (
            <form onSubmit={handleDailyLogSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={dailyLog.date}
                  onChange={(e) =>
                    setDailyLog({ ...dailyLog, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={dailyLog.notes}
                  onChange={(e) =>
                    setDailyLog({ ...dailyLog, notes: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Add any notes about the patient's day..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
                >
                  {loading ? 'Saving...' : 'Save Daily Log'}
                </button>
              </div>
            </form>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMediaChange}
                  className="hidden"
                  id="media-input"
                />
                <label
                  htmlFor="media-input"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              </div>

              {mediaPreview && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </p>
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={handleMediaUpload}
                  disabled={!mediaFile || uploadingMedia}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
                >
                  {uploadingMedia ? 'Uploading...' : 'Upload Image'}
                </button>
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
