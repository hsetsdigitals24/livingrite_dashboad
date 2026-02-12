'use client';

import React, { useState } from 'react';

interface PaymentManagementModalProps {
  bookingId: string;
  payment: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    providerRef?: string;
    paidAt?: string;
  } | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function PaymentManagementModal({
  bookingId,
  payment,
  onClose,
  onUpdate,
}: PaymentManagementModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkAsPaid = async () => {
    if (!payment) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/payments/${payment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update payment');
      }

      onUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate invoice');
      }

      onUpdate();
      alert('Invoice generated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Payment Management</h2>

        {payment ? (
          <>
            <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded">
              <div>
                <label className="text-sm text-gray-600">Amount</label>
                <p className="text-lg font-semibold">
                  {payment.currency} {payment.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <p>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      payment.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </p>
              </div>
              {payment.paidAt && (
                <div>
                  <label className="text-sm text-gray-600">Paid At</label>
                  <p>{new Date(payment.paidAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {payment.status !== 'PAID' && (
                <button
                  onClick={handleMarkAsPaid}
                  disabled={loading}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {loading ? 'Processing...' : 'Mark as Paid'}
                </button>
              )}

              <button
                onClick={handleGenerateInvoice}
                disabled={loading}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium"
              >
                {loading ? 'Processing...' : 'Generate Invoice'}
              </button>

              <button
                onClick={onClose}
                disabled={loading}
                className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 disabled:bg-gray-400 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No payment found for this booking</p>
            <button
              onClick={onClose}
              className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
