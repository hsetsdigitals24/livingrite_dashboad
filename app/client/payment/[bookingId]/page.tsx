'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface PaymentConfig {
  publicKey: string;
  email: string;
  amount: number;
  reference: string;
  metadata: {
    bookingId: string;
    serviceName?: string;
    clientName: string;
  };
}

interface PaymentData {
  id: string;
  amount: number;
  currency: string;
  reference: string;
}

export default function ClientPaymentPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const router = useRouter();
  const { data: session } = useSession();
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [paystackConfig, setPaystackConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  useEffect(() => {
    if (!session) return;
    initiatePayment();
  }, [session, bookingId]);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to initiate payment');
      }

      const data = await response.json();
      setPayment(data.payment);
      setPaystackConfig(data.paystackConfig);
      loadPaystackScript();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadPaystackScript = () => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const handlePayment = () => {
    if (!paystackConfig || !(window as any).PaystackPop) {
      setError('Payment system not ready. Please refresh and try again.');
      return;
    }

    (window as any).PaystackPop.setup({
      key: paystackConfig.publicKey,
      email: paystackConfig.email,
      amount: paystackConfig.amount,
      ref: paystackConfig.reference,
      metadata: paystackConfig.metadata,
      onClose: () => {
        setError('Payment window closed.');
      },
      onSuccess: (response: any) => {
        verifyPayment(response.reference);
      },
    }).openIframe();
  };

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch(`/api/payments/verify/${reference}`);
      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      const data = await response.json();
      if (data.verified) {
        setPaymentStatus('success');
        setTimeout(() => {
          router.push(`/client/booking/manage?success=true&bookingId=${bookingId}`);
        }, 2000);
      } else {
        setPaymentStatus('failed');
        setError('Payment verification failed. Please try again.');
      }
    } catch (err) {
      setPaymentStatus('failed');
      setError(err instanceof Error ? err.message : 'Payment verification failed');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to proceed with payment</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded text-sm">
            <p className="font-semibold">Payment successful!</p>
            <p>Redirecting to booking details...</p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded text-sm">
            <p className="font-semibold">Payment failed</p>
            <p>Please try again or contact support</p>
          </div>
        )}

        {payment && (
          <>
            <div className="space-y-4 mb-8 p-4 bg-gray-50 rounded">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Amount</label>
                <p className="text-2xl font-bold text-gray-900">
                  {payment.currency} {payment.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Reference</label>
                <p className="text-sm text-gray-700 font-mono break-all">
                  {payment.reference}
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={paymentStatus !== 'pending'}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors mb-3"
            >
              {paymentStatus === 'pending' ? 'Pay Now' : 'Processing...'}
            </button>
          </>
        )}

        <button
          onClick={() => router.back()}
          className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back
        </button>

        <p className="text-xs text-gray-500 text-center mt-6">
          Secure payment powered by Paystack
        </p>
      </div>
    </div>
  );
}
