"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");

  useEffect(() => {
    // Fetch booking details
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data);
        
        // Set payment amount based on service pricing
        const price = data.service?.basePrice || data.amount || 50000;
        const currency = data.service?.currency || data.currency || "NGN";
        
        setPaymentAmount(price);
        // Store currency if needed
        console.log(`Pricing: ${price} ${currency}`);
      } else {
        setError("Booking not found");
      }
    } catch (err) {
      setError("Failed to fetch booking details");
    }
  };

 

  const handlePayment = async () => {
    if (!booking) {
      setError("Booking information is missing");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Initialize payment
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: booking.clientEmail,
          amount: paymentAmount,
          bookingId: booking.id,
          clientName: booking.clientName,
        }),
      });

      const data = await response.json();

      if (data.authorizationUrl) {
        // Redirect to Paystack
        window.location.href = data.authorizationUrl;
      } else {
        setError(data.error || "Failed to initialize payment");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleDate) {
      setError("Please select a new date");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledAt: rescheduleDate,
        }),
      });

      if (response.ok) {
        setShowRescheduleModal(false);
        setError("");
        await fetchBooking();
      } else {
        setError("Failed to reschedule booking");
      }
    } catch (err) {
      setError("Error rescheduling booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setShowCancelModal(false);
        router.push("/");
      } else {
        setError("Failed to cancel booking");
      }
    } catch (err) {
      setError("Error cancelling booking");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${bookingId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${bookingId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Failed to download invoice");
      }
    } catch (err) {
      setError("Error downloading invoice");
    }
  };

  if (!booking) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Payment</h1>

      {/* Booking Summary */}
      <div className="bg-gray-50 p-4 rounded-md mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Client:</span>
          <span className="font-medium">{booking.clientName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Email:</span>
          <span className="font-medium text-blue-600">
            {booking.clientEmail}
          </span>
        </div>
        {booking.clientPhone && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{booking.clientPhone}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Scheduled:</span>
          <span className="font-medium">
            {new Date(booking.scheduledAt).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Timezone:</span>
          <span className="font-medium">{booking.clientTimezone}</span>
        </div>
        <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-lg">
          <span>Total Amount:</span>
          <span className="text-green-600">
            ₦{paymentAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
        <p className="text-sm text-blue-900">
          <strong>Next Steps:</strong> Your intake form has been submitted.
          Click below to complete payment and secure your consultation booking.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6 text-red-700">
          {error}
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Processing...
          </>
        ) : (
          <>💳 Pay with Paystack (₦{paymentAmount.toLocaleString()})</>
        )}
      </button>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={() => setShowRescheduleModal(true)}
          disabled={loading}
          className="bg-orange-500 text-white py-2 px-4 rounded-md font-medium hover:bg-orange-600 disabled:opacity-50 transition"
        >
          📅 Reschedule
        </button>
        <button
          onClick={() => setShowCancelModal(true)}
          disabled={loading}
          className="bg-red-500 text-white py-2 px-4 rounded-md font-medium hover:bg-red-600 disabled:opacity-50 transition"
        >
          ❌ Cancel
        </button>
      </div>

      {/* Download Invoice */}
      <button
        onClick={downloadInvoice}
        disabled={loading}
        className="w-full mt-3 bg-gray-600 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-700 disabled:opacity-50 transition"
      >
        📄 Download Invoice
      </button>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Reschedule Consultation</h2>
            <input
              type="datetime-local"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleReschedule}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowRescheduleModal(false)}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Cancel Consultation?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this consultation? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition"
              >
                {loading ? "Processing..." : "Yes, Cancel"}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50 transition"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Info */}
      <div className="mt-6 pt-6 border-t text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment is secure and encrypted
        </p>
        <p className="text-xs text-gray-500 mt-1">Powered by Paystack</p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto mt-20 p-6 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
