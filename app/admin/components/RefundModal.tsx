'use client';

import React, { useState } from 'react';

interface RefundModalProps {
  paymentId: string;
  amount: number;
  currency: string;
  onClose: () => void;
  onUpdate: () => void;
}

export function RefundModal({
  paymentId,
  amount,
  currency,
  onClose,
  onUpdate,
}: RefundModalProps) {
  const [refundAmount, setRefundAmount] = useState(amount);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitRefund = async () => {
    if (!reason.trim()) {
      setError('Reason is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: refundAmount,
          reason,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to request refund');
      }

      onUpdate();
      onClose();
      alert('Refund requested successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Request Refund</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Amount
            </label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
              max={amount}
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {currency} {amount.toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Refund
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for refund..."
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmitRefund}
            disabled={loading || !reason.trim()}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 transition-colors font-medium"
          >
            {loading ? 'Processing...' : 'Request Refund'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
