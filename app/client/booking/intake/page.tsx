"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

interface IntakeForm {
  healthHistory: string;
  currentConcerns: string;
  goals: string;
  medications: string;
  allergies: string;
  additionalInfo: string;
}

function IntakeFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [intakeData, setIntakeData] = useState<IntakeForm>({
    healthHistory: "",
    currentConcerns: "",
    goals: "",
    medications: "",
    allergies: "",
    additionalInfo: "",
  });

  useEffect(() => {
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
        if (data.intakeFormData && Object.keys(data.intakeFormData).length > 0) {
          setIntakeData(data.intakeFormData);
        }
      } else {
        setError("Booking not found");
      }
    } catch (err) {
      setError("Failed to fetch booking details");
    }
  };

  const handleChange = (field: keyof IntakeForm, value: string) => {
    setIntakeData((prev) => ({ ...prev, [field]: value }));
  };

  const submitIntakeForm = async () => {
    if (!intakeData.currentConcerns || !intakeData.goals) {
      setError("Please fill in required fields: Current Concerns and Goals");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeForm: intakeData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save intake form");
        return;
      }

      setSubmitted(true);
      setTimeout(() => router.push("/client"), 3000);
    } catch (err) {
      setError("Error saving intake form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!booking && !error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading booking details...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Done!</h2>
        <p className="text-gray-600 mb-1">Your intake form has been submitted successfully.</p>
        <p className="text-gray-500 text-sm">Redirecting you to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl text-accent font-bold mb-2 text-center">
        Pre-Consultation Intake Form
      </h1>
      <p className="text-center text-gray-500 text-sm mb-6">
        Please complete this form before your consultation. All information is kept confidential.
      </p>

      {/* Booking Summary */}
      {booking && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6 space-y-2">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Consultation Details</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{booking.clientName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Scheduled:</span>
            <span className="font-medium">
              {new Date(booking.scheduledAt).toLocaleString()}
            </span>
          </div>
          {booking.timezone && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Timezone:</span>
              <span className="font-medium">{booking.timezone}</span>
            </div>
          )}
        </div>
      )}

      {error && !booking && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Intake Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Concerns <span className="text-red-500">*</span>
          </label>
          <textarea
            value={intakeData.currentConcerns}
            onChange={(e) => handleChange("currentConcerns", e.target.value)}
            placeholder="What brings you to this consultation? Describe your main concerns..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Goals <span className="text-red-500">*</span>
          </label>
          <textarea
            value={intakeData.goals}
            onChange={(e) => handleChange("goals", e.target.value)}
            placeholder="What would you like to achieve from this consultation?"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Health History
          </label>
          <textarea
            value={intakeData.healthHistory}
            onChange={(e) => handleChange("healthHistory", e.target.value)}
            placeholder="Any relevant health history, diagnoses, or previous treatments..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Medications
            </label>
            <input
              type="text"
              value={intakeData.medications}
              onChange={(e) => handleChange("medications", e.target.value)}
              placeholder="List any current medications..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Allergies
            </label>
            <input
              type="text"
              value={intakeData.allergies}
              onChange={(e) => handleChange("allergies", e.target.value)}
              placeholder="Any known allergies..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Information
          </label>
          <textarea
            value={intakeData.additionalInfo}
            onChange={(e) => handleChange("additionalInfo", e.target.value)}
            placeholder="Anything else you would like us to know before your consultation..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={submitIntakeForm}
            disabled={loading}
            className="flex-1 bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Submitting..." : "Submit Intake Form"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/client")}
            disabled={loading}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IntakeFormPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto mt-20 p-6 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      }
    >
      <IntakeFormContent />
    </Suspense>
  );
}
