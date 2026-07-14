"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { useRouter } from "next/navigation";
import { BOOKING_LINK } from "@/lib/booking-link";

// Extract the invitee UUID from a Calendly invitee URI, e.g.
// https://api.calendly.com/scheduled_events/XXX/invitees/<UUID>
function getInviteeId(uri?: string): string | null {
  if (!uri) return null;
  const parts = uri.split("/").filter(Boolean);
  return parts[parts.length - 1] || null;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
}

export default function BookingModal({
  isOpen,
  onClose,
  patients,
}: BookingModalProps) {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    patients.length > 0 ? patients[0] : null
  );
  const [showCalendar, setShowCalendar] = useState(false);

  useCalendlyEventListener({
    onEventScheduled: (e) => {
      const bookingId = getInviteeId(e.data.payload.invitee?.uri);
      if (bookingId) {
        router.push(`/client/booking/intake?bookingId=${bookingId}`);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {showCalendar ? "Schedule Consultation" : "Book a Consultation"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showCalendar ? (
            <>
              {/* Patient Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Select Family Member <span className="text-red-500">*</span>
                </label>

                {patients.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                    No family members found. Please add a family member first.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {patients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          selectedPatient?.id === patient.id
                            ? "border-teal-600 bg-teal-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        {patient.email && (
                          <div className="text-sm text-gray-600 mt-1">
                            {patient.email}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Information */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> After selecting a family member and scheduling,
                  you'll fill out a short intake form before your consultation.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCalendar(true)}
                  disabled={!selectedPatient || patients.length === 0}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Continue to Scheduling
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Patient Info */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Scheduling for: <strong>{selectedPatient?.firstName} {selectedPatient?.lastName}</strong>
                </p>
              </div>

              {/* Calendly Calendar Embed */}
              <div className="min-h-[600px] bg-gray-50 rounded-lg overflow-hidden">
                <InlineWidget
                  url={BOOKING_LINK}
                  styles={{ width: "100%", height: "100%", minHeight: "600px" }}
                />
              </div>

              {/* Back Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


