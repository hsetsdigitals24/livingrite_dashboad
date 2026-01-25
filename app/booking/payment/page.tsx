'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PaystackPop from '@paystack/inline-js';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchBooking();
    }
  }, [eventId]);

  const fetchBooking = async () => {
    const res = await fetch(`/api/bookings/${eventId}`);
    const data = await res.json();
    setBooking(data);
    setLoading(false);
  };

  const handlePayment = () => {
    const paystack = new PaystackPop();
    
    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: booking.clientEmail,
      amount: booking.paymentAmount * 100, // Amount in kobo
      currency: 'NGN',
      reference: `BK-${booking.id}-${Date.now()}`,  // Changed from 'ref' to 'reference'
      metadata: {
        custom_fields: [
          {
            display_name: 'Booking ID',
            variable_name: 'bookingId',
            value: booking.id,
          },
          {
            display_name: 'Client Name',
            variable_name: 'clientName',
            value: booking.clientName,
          },
        ],
      },
      onSuccess: (transaction: any) => {
        // Verify payment on backend
        fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: transaction.reference,
            bookingId: booking.id,
          }),
        }).then(() => {
          window.location.href = '/booking/confirmation';
        });
      },
      onCancel: () => {
        alert('Payment cancelled');
      },
    });
  };

  if (loading) return <div>Loading...</div>;

  if (!booking.requiresPayment) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Booking Confirmed!</h1>
        <p>No payment required. Check your email for confirmation.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
        <p><strong>Service:</strong> Consultation</p>
        <p><strong>Date:</strong> {new Date(booking.scheduledAt).toLocaleString()}</p>
        <p><strong>Amount:</strong> ₦{booking.paymentAmount?.toLocaleString()}</p>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        Pay Now
      </button>
    </div>
  );
}