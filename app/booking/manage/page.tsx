'use client';

import { useState } from 'react';

export default function ManageBooking() {
  const [eventUri, setEventUri] = useState('');

  const handleReschedule = () => {
    window.location.href = `${eventUri}/reschedule`;
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel?')) return;

    const eventId = eventUri.split('/').pop();
    await fetch(`/api/bookings/${eventId}/cancel`, {
      method: 'POST',
    });

    alert('Booking cancelled successfully');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Your Booking</h1>
      
      <input
        type="text"
        placeholder="Paste your Calendly event link"
        value={eventUri}
        onChange={(e) => setEventUri(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <div className="flex gap-4">
        <button
          onClick={handleReschedule}
          className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Reschedule
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 bg-red-600 text-white py-3 rounded hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}