'use client';

import { useState } from 'react';

export default function ManageBooking() {
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Booking cancelled successfully');
        setBookingId('');
      } else {
        alert('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Your Booking</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          To reschedule or cancel your consultation, please enter your booking ID or contact our support team.
        </p>
        
        <input
          type="text"
          placeholder="Enter your booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleCancel}
          disabled={!bookingId || loading}
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Cancel Booking'}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          For rescheduling, please contact our team directly or use the Cal.com link provided in your confirmation email.
        </p>
      </div>
    </div>
  );
}