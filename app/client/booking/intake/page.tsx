"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface IntakeForm {
  healthHistory: string;
  currentConcerns: string;
  goals: string;
  medications: string;
  allergies: string;
  additionalInfo: string;
}

interface Service {
  id: string;
  title: string;
  description: string | null;
  basePrice: number | null;
  currency: string;
  pricingConfig: any;
}

function IntakeFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [error, setError] = useState("");
  const [isFreebooking, setIsFreebooking] = useState(true);
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
      fetchServices();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data);

        console.log("Fetched booking:", data);

        // Check if this is a free booking (no payment or pending payment)
        const isFree = data.payment.status === 'FREE';
        setIsFreebooking(isFree);

        // Pre-fill intake form if it exists
        if (data.intakeFormData) {
          setIntakeData(data.intakeFormData);
        }
      } else {
        setError("Booking not found");
      }
    } catch (err) {
      setError("Failed to fetch booking details");
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
        // Auto-select first service
        if (data.length > 0) {
          setSelectedService(data[0]);
        }
      } else {
        setError("Failed to fetch services");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services");
    }
  };

  const handleIntakeFormChange = (field: keyof IntakeForm, value: string) => {
    setIntakeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitIntakeForm = async () => {
    if (!intakeData.currentConcerns || !intakeData.goals) {
      setError("Please fill in required fields (Current Concerns and Goals)");
      return;
    }

    if (!isFreebooking && !selectedService) {
      setError("Please select a service");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intakeForm: intakeData,
          ...(selectedService && { serviceId: selectedService.id }),
        }),
      });

      if (response.ok) {
        // Redirect to payment page
        router.push(`/portal/booking/payment?bookingId=${bookingId}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save intake form");
      }
    } catch (err) {
      setError("Error saving intake form");
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl text-accent font-bold mb-6 text-center">
        Pre-Consultation Intake Form
      </h1>

      {/* Booking Summary */}
      <div className="bg-gray-50 p-4 rounded-md mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Client:</span>
          <span className="font-medium">{booking.clientName}</span>
        </div>
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
        {isFreebooking && (
          <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded text-green-800 text-sm font-semibold">
            ✓ Free Consultation
          </div>
        )}
      </div>

      {/* Service Selection - Only show if NOT free booking */}
      {!isFreebooking && services.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Service <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedService?.id === service.id
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300 hover:border-blue-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        {service.description}
                      </p>
                    )}
                  </div>
                  {service.basePrice && (
                    <div className="text-right ml-4">
                      <p className="font-bold text-green-600">
                        ₦{service.basePrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{service.currency}</p>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <input
                    type="radio"
                    name="service"
                    checked={selectedService?.id === service.id}
                    onChange={() => setSelectedService(service)}
                    className="accent-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Service Summary */}
      {selectedService && !isFreebooking && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Selected Service:</p>
              <p className="font-semibold text-gray-900">{selectedService.title}</p>
            </div>
            {selectedService.basePrice && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Amount to Pay:</p>
                <p className="font-bold text-lg text-green-600">
                  ₦{selectedService.basePrice.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Intake Form */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Concerns <span className="text-red-500">*</span>
          </label>
          <textarea
            value={intakeData.currentConcerns}
            onChange={(e) =>
              handleIntakeFormChange("currentConcerns", e.target.value)
            }
            placeholder="What brings you to this consultation?"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Goals <span className="text-red-500">*</span>
          </label>
          <textarea
            value={intakeData.goals}
            onChange={(e) => handleIntakeFormChange("goals", e.target.value)}
            placeholder="What would you like to achieve from this consultation?"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Health History
          </label>
          <textarea
            value={intakeData.healthHistory}
            onChange={(e) =>
              handleIntakeFormChange("healthHistory", e.target.value)
            }
            placeholder="Any relevant health history..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Medications
            </label>
            <input
              type="text"
              value={intakeData.medications}
              onChange={(e) =>
                handleIntakeFormChange("medications", e.target.value)
              }
              placeholder="List any medications..."
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
              onChange={(e) =>
                handleIntakeFormChange("allergies", e.target.value)
              }
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
            onChange={(e) =>
              handleIntakeFormChange("additionalInfo", e.target.value)
            }
            placeholder="Anything else we should know..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={submitIntakeForm}
            disabled={loading}
            className="flex-1 bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Saving..." : "Continue to Payment"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/portal/booking")}
            disabled={loading}
            className="flex-1 bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium hover:bg-gray-400 disabled:opacity-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
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
