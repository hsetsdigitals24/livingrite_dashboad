'use client';

import { useState, useEffect } from 'react';
import { Building2, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface PaymentSettingsData {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  additionalInfo: string;
}

export default function PaymentSettingsSection() {
  const [settings, setSettings] = useState<PaymentSettingsData>({
    bankName: '',
    accountName: '',
    accountNumber: '',
    bankCode: '',
    additionalInfo: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/payment-settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          bankName: data.bankName || '',
          accountName: data.accountName || '',
          accountNumber: data.accountNumber || '',
          bankCode: data.bankCode || '',
          additionalInfo: data.additionalInfo || '',
        });
      }
    } catch (err) {
      console.error('Failed to load payment settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (!settings.bankName || !settings.accountName || !settings.accountNumber) {
      setError('Bank name, account name, and account number are required.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccess('Payment settings saved successfully.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <div className="animate-spin inline-block w-6 h-6 border-4 border-teal-600 border-t-transparent rounded-full"></div>
        <p className="mt-3 text-sm sm:text-base text-gray-500">Loading payment settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-full md:max-w-2xl space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
          <Building2 className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h3 className="font-semibold text-sm sm:text-base text-gray-900">Bank Account Details</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            These details will be included in every invoice email sent to clients.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {success}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={settings.bankName}
            onChange={(e) => setSettings((p) => ({ ...p, bankName: e.target.value }))}
            placeholder="e.g. First Bank of Nigeria"
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
            Account Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={settings.accountName}
            onChange={(e) => setSettings((p) => ({ ...p, accountName: e.target.value }))}
            placeholder="e.g. LivingRite Care Limited"
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={settings.accountNumber}
            onChange={(e) => setSettings((p) => ({ ...p, accountNumber: e.target.value }))}
            placeholder="e.g. 0123456789"
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-mono tracking-wider"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
            Sort Code / Bank Code{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={settings.bankCode}
            onChange={(e) => setSettings((p) => ({ ...p, bankCode: e.target.value }))}
            placeholder="e.g. 011"
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
            Additional Payment Instructions{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={settings.additionalInfo}
            onChange={(e) => setSettings((p) => ({ ...p, additionalInfo: e.target.value }))}
            placeholder="e.g. Please use your invoice number as the payment reference..."
            rows={3}
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
          />
        </div>
      </div>

      {/* Preview */}
      {(settings.bankName || settings.accountName || settings.accountNumber) && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-3">
            Preview — How it will appear in invoice emails
          </p>
          <div className="space-y-1.5 text-sm text-gray-700">
            {settings.bankName && (
              <div className="flex gap-2">
                <span className="text-gray-500 w-32 flex-shrink-0">Bank:</span>
                <span className="font-medium">{settings.bankName}</span>
              </div>
            )}
            {settings.accountName && (
              <div className="flex gap-2">
                <span className="text-gray-500 w-32 flex-shrink-0">Account Name:</span>
                <span className="font-medium">{settings.accountName}</span>
              </div>
            )}
            {settings.accountNumber && (
              <div className="flex gap-2">
                <span className="text-gray-500 w-32 flex-shrink-0">Account No.:</span>
                <span className="font-bold tracking-wider text-emerald-700">{settings.accountNumber}</span>
              </div>
            )}
            {settings.bankCode && (
              <div className="flex gap-2">
                <span className="text-gray-500 w-32 flex-shrink-0">Sort Code:</span>
                <span className="font-medium">{settings.bankCode}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition"
      >
        <Save className="w-4 h-4" />
        {isSaving ? 'Saving...' : 'Save Payment Settings'}
      </button>
    </div>
  );
}
