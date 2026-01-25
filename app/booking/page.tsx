'use client';

import { useEffect, useState } from 'react';
import { InlineWidget } from 'react-calendly';

export default function BookingPage() {
  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    // Auto-detect timezone
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const handleEventScheduled = (e: any) => {
    // Redirect to payment if needed
    const { uri } = e.data.payload;
    const eventId = uri.split('/').pop();
    window.location.href = `/booking/payment?event=${eventId}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Schedule Your Consultation</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <InlineWidget
          url="https://calendly.com/your-username/consultation"
          prefill={{
            customAnswers: {
              a1: timezone, // Pass timezone to custom question
            },
          }}
          utm={{
            utmSource: 'website',
            utmMedium: 'booking_page',
          }}
          pageSettings={{
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
          }}
          styles={{
            height: '700px',
          }}
        />
      </div>
      
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('message', function(e) {
              if (e.data.event === 'calendly.event_scheduled') {
                window.location.href = '/booking/payment?event=' + 
                  e.data.payload.event.uri.split('/').pop();
              }
            });
          `,
        }}
      />
    </div>
  );
}