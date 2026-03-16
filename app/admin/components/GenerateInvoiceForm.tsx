"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  service?: {
    basePrice: number;
    title: string;
  };
  payment?: {
    amount: number;
    currency: string;
  };
}

interface GenerateInvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GenerateInvoiceForm({ isOpen, onClose, onSuccess }: GenerateInvoiceFormProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");
  const [tax, setTax] = useState("");
  const [discount, setDiscount] = useState("0");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [error, setError] = useState("");

  // Load available bookings on mount
  useEffect(() => {
    if (isOpen) {
      loadBookings();
    }
  }, [isOpen]);

  // Calculate total amount whenever any value changes
  useEffect(() => {
    if (amount && tax !== "") {
      const amountNum = parseFloat(amount) || 0;
      const taxNum = parseFloat(tax) || 0;
      const discountNum = parseFloat(discount) || 0;
      const total = amountNum + taxNum - discountNum;
      setTotalAmount(Math.max(0, total));
    }
  }, [amount, tax, discount]);

  const loadBookings = async () => {
    try {
      setIsLoadingBookings(true);
      const response = await fetch("/api/bookings/list?invoiceStatus=no-invoice");
      if (!response.ok) throw new Error("Failed to load bookings");
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleBookingSelect = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      // Set default amounts from booking
      const defaultAmount = booking.payment?.amount || booking.service?.basePrice || "";
      setAmount(defaultAmount.toString());
      setTax((parseFloat(defaultAmount.toString()) * 0.1).toFixed(2));
      setDiscount("0");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedBookingId) {
      setError("Please select a booking");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (parseFloat(discount) >= parseFloat(amount)) {
      setError("Discount cannot be equal to or greater than amount");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          amount: parseFloat(amount),
          currency: "NGN",
          tax: parseFloat(tax) || parseFloat(amount) * 0.1,
          discount: parseFloat(discount),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate invoice");
      }

      // Success
      setError("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate invoice");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Generate Invoice</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Booking Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Booking *
            </label>
            {isLoadingBookings ? (
              <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-600">
                Loading bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-3 bg-yellow-50 rounded border border-yellow-200 text-yellow-700">
                No bookings available for invoicing
              </div>
            ) : (
              <select
                value={selectedBookingId}
                onChange={(e) => handleBookingSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Select a booking --</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.clientName} ({booking.clientEmail})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Booking Details Display */}
          {selectedBooking && (
            <div className="p-3 bg-teal-50 rounded border border-teal-200">
              <p className="text-sm text-gray-600">
                <strong>Service:</strong>{" "}
                {selectedBooking.service?.title || "No service specified"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {selectedBooking.clientEmail}
              </p>
            </div>
          )}

          {/* Amount Fields */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tax
              </label>
              <input
                type="number"
                step="0.01"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                {amount ? `(${((parseFloat(tax) / parseFloat(amount)) * 100).toFixed(1)}%)` : ""}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount
              </label>
              <input
                type="number"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Total Amount Display */}
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Amount:</span>
              <span className="text-2xl font-bold text-teal-600">
                ₦{totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Breakdown Summary */}
          {amount && (
            <div className="text-sm text-gray-600 space-y-1 p-3 bg-gray-50 rounded">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>₦{parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₦{parseFloat(tax).toLocaleString()}</span>
              </div>
              {parseFloat(discount) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-₦{parseFloat(discount).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedBookingId || !amount}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Generating..." : "Generate Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
