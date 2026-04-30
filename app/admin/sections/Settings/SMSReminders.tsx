'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Save, RotateCcw } from 'lucide-react';

interface SMSSettings {
  id: string;
  preConsultationTemplate: string;
  preConsultationEnabled: boolean;
  postConsultationTemplate: string;
  postConsultationEnabled: boolean;
  followUpTemplate: string;
  followUpEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

const SMSRemindersSettings = () => {
  const [settings, setSettings] = useState<SMSSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    preConsultationTemplate: '',
    preConsultationEnabled: true,
    postConsultationTemplate: '',
    postConsultationEnabled: true,
    followUpTemplate: '',
    followUpEnabled: true,
  });

  const [charCounts, setCharCounts] = useState({
    preConsultation: 0,
    postConsultation: 0,
    followUp: 0,
  });

  // Template variables helper
  const templateVariables = {
    preConsultation: ['{clientName}', '{consultationTime}'],
    postConsultation: ['{clientName}', '{feedbackLink}'],
    followUp: ['{clientName}'],
  };

  const SMSCharLimit = 160;

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sms-settings');
      if (!response.ok) {
        throw new Error('Failed to fetch SMS settings');
      }
      const result = await response.json();
      setSettings(result.data);
      setFormData({
        preConsultationTemplate: result.data.preConsultationTemplate,
        preConsultationEnabled: result.data.preConsultationEnabled,
        postConsultationTemplate: result.data.postConsultationTemplate,
        postConsultationEnabled: result.data.postConsultationEnabled,
        followUpTemplate: result.data.followUpTemplate,
        followUpEnabled: result.data.followUpEnabled,
      });
      setCharCounts({
        preConsultation: result.data.preConsultationTemplate.length,
        postConsultation: result.data.postConsultationTemplate.length,
        followUp: result.data.followUpTemplate.length,
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching SMS settings:', err);
      setError('Failed to load SMS settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (
    field: 'preConsultationTemplate' | 'postConsultationTemplate' | 'followUpTemplate',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update character count
    const charCountField = field.replace('Template', '') as keyof typeof charCounts;
    setCharCounts((prev) => ({
      ...prev,
      [charCountField]: value.length,
    }));
  };

  const handleToggle = (
    field: 'preConsultationEnabled' | 'postConsultationEnabled' | 'followUpEnabled'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/admin/sms-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save SMS settings');
      }

      const result = await response.json();
      setSettings(result.data);
      setSuccessMessage('SMS reminder settings saved successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('Error saving SMS settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) {
      setFormData({
        preConsultationTemplate: settings.preConsultationTemplate,
        preConsultationEnabled: settings.preConsultationEnabled,
        postConsultationTemplate: settings.postConsultationTemplate,
        postConsultationEnabled: settings.postConsultationEnabled,
        followUpTemplate: settings.followUpTemplate,
        followUpEnabled: settings.followUpEnabled,
      });
      setCharCounts({
        preConsultation: settings.preConsultationTemplate.length,
        postConsultation: settings.postConsultationTemplate.length,
        followUp: settings.followUpTemplate.length,
      });
      setError(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading SMS settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">SMS Reminder Settings</h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure the SMS messages sent to clients after bookings and consultations.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Templates */}
      <div className="space-y-6">
        {/* 12-Hour Pre-Consultation */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                12-Hour Pre-Consultation Reminder
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Sent 12 hours before the scheduled consultation
              </p>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.preConsultationEnabled}
                onChange={() => handleToggle('preConsultationEnabled')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {formData.preConsultationEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="preConsultation" className="block text-sm font-medium text-gray-700">
              Template
            </label>
            <textarea
              id="preConsultation"
              value={formData.preConsultationTemplate}
              onChange={(e) =>
                handleTemplateChange('preConsultationTemplate', e.target.value)
              }
              disabled={!formData.preConsultationEnabled}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter SMS template..."
            />
            <div className="flex justify-between">
              <div className="text-xs text-gray-500">
                Character count: {charCounts.preConsultation}/{SMSCharLimit}
                {charCounts.preConsultation > SMSCharLimit && (
                  <span className="ml-2 text-red-600 font-medium">
                    ({charCounts.preConsultation - SMSCharLimit} over limit)
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Variables: {templateVariables.preConsultation.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Post-Consultation Thank You */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Post-Consultation Thank You
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Sent 30 minutes to 2 hours after the consultation ends
              </p>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.postConsultationEnabled}
                onChange={() => handleToggle('postConsultationEnabled')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {formData.postConsultationEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="postConsultation"
              className="block text-sm font-medium text-gray-700"
            >
              Template
            </label>
            <textarea
              id="postConsultation"
              value={formData.postConsultationTemplate}
              onChange={(e) =>
                handleTemplateChange('postConsultationTemplate', e.target.value)
              }
              disabled={!formData.postConsultationEnabled}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter SMS template..."
            />
            <div className="flex justify-between">
              <div className="text-xs text-gray-500">
                Character count: {charCounts.postConsultation}/{SMSCharLimit}
                {charCounts.postConsultation > SMSCharLimit && (
                  <span className="ml-2 text-red-600 font-medium">
                    ({charCounts.postConsultation - SMSCharLimit} over limit)
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Variables: {templateVariables.postConsultation.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* 48-Hour Follow-Up */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">48-Hour Follow-Up</h3>
              <p className="mt-1 text-sm text-gray-600">
                Sent 48 hours after the consultation is completed
              </p>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.followUpEnabled}
                onChange={() => handleToggle('followUpEnabled')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {formData.followUpEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="followUp" className="block text-sm font-medium text-gray-700">
              Template
            </label>
            <textarea
              id="followUp"
              value={formData.followUpTemplate}
              onChange={(e) => handleTemplateChange('followUpTemplate', e.target.value)}
              disabled={!formData.followUpEnabled}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter SMS template..."
            />
            <div className="flex justify-between">
              <div className="text-xs text-gray-500">
                Character count: {charCounts.followUp}/{SMSCharLimit}
                {charCounts.followUp > SMSCharLimit && (
                  <span className="ml-2 text-red-600 font-medium">
                    ({charCounts.followUp - SMSCharLimit} over limit)
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Variables: {templateVariables.followUp.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={handleReset}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Info Section */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="font-medium text-blue-900">Template Variables Reference</h4>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li>
            <code className="rounded bg-blue-100 px-2 py-1">{'{clientName}'}</code> - Client&apos;s
            full name
          </li>
          <li>
            <code className="rounded bg-blue-100 px-2 py-1">{'{consultationTime}'}</code> -
            Formatted consultation date and time
          </li>
          <li>
            <code className="rounded bg-blue-100 px-2 py-1">{'{feedbackLink}'}</code> - URL for
            feedback submission
          </li>
        </ul>
        <p className="mt-3 text-xs text-blue-700">
          ⚠️ Each template must include all required variables. SMS messages longer than{' '}
          {SMSCharLimit} characters may be split into multiple messages.
        </p>
      </div>
    </div>
  );
};

export default SMSRemindersSettings;
