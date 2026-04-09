"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface DoctorAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  postUrl?: string; // allows reuse between caregiver and client endpoints
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

interface Caregiver {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export default function DoctorAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  postUrl,
}: DoctorAppointmentModalProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [assignedCaregivers, setAssignedCaregivers] = useState<Caregiver[]>([]);
  const [loadingCaregivers, setLoadingCaregivers] = useState(false);
  const [date, setDate] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) fetchPatients();
  }, [isOpen, postUrl]);

  useEffect(() => {
    if (selectedPatientId) {
      fetchAssignedCaregivers(selectedPatientId);
      setProvider(""); // Reset provider when patient changes
    } else {
      setAssignedCaregivers([]);
      setProvider("");
    }
  }, [selectedPatientId]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Determine the correct endpoint based on context
      const patientsEndpoint = postUrl?.includes("/client/") 
        ? "/api/client/patients" 
        : "/api/caregiver/patients";
      
      const res = await fetch(patientsEndpoint);
      const json = await res.json();
      
      // Handle both array and object responses
      const patientList = Array.isArray(json) ? json : (json.patients || json.data || []);
      
      if (patientList.length > 0) {
        setPatients(patientList.map((p: any) => ({ 
          id: p.id, 
          firstName: p.patient?.firstName || p.firstName, 
          lastName: p.patient?.lastName || p.lastName 
        })));
      } else {
        setError("No patients found");
      }
    } catch (err) {
      setError("Failed to load patients");
      console.error("Patient fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedCaregivers = async (patientId: string) => {
    setLoadingCaregivers(true);
    try {
      // Use the dedicated caregivers endpoint for both client and caregiver contexts
      // This endpoint supports both CLIENT (with family member access) and CAREGIVER roles
      const endpoint = `/api/caregiver/patients/${patientId}/caregivers`;
      
      const res = await fetch(endpoint);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch caregivers: ${res.status}`);
      }
      
      const json = await res.json();
      let caregivers: Caregiver[] = [];
      
      if (!json.caregivers || !Array.isArray(json.caregivers) || json.caregivers.length === 0) {
        setAssignedCaregivers([]);
        setError("No caregivers assigned to this patient");
        return;
      }
      
      // Parse caregiver data
      caregivers = json.caregivers
        .filter((caregiver: any) => caregiver.id)
        .map((caregiver: any) => {
          const fullName = caregiver.name || `${caregiver.firstName || ""} ${caregiver.lastName || ""}`.trim();
          const nameParts = fullName.split(" ");
          return {
            id: caregiver.id,
            firstName: nameParts[0] || "Unknown",
            lastName: nameParts.slice(1).join(" ") || "Caregiver",
            email: caregiver.email
          };
        });
      
      setAssignedCaregivers(caregivers);
      if (caregivers.length === 0) {
        setError("No caregivers assigned to this patient");
      }
    } catch (err) {
      console.error("Failed to load caregivers:", err);
      setAssignedCaregivers([]);
      setError(err instanceof Error ? err.message : "Failed to load assigned caregivers");
    } finally {
      setLoadingCaregivers(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPatientId || !date || !provider || !reason) {
      setError("Please fill out all required fields");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const endpoint = postUrl || "/api/caregiver/doctor-appointments";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: selectedPatientId, date, provider, reason, notes }),
      });
      const json = await res.json();
      if (json.success) {
        // Reset form
        setSelectedPatientId("");
        setDate("");
        setProvider("");
        setReason("");
        setNotes("");
        setError("");
        onSuccess && onSuccess();
        onClose();
      } else {
        setError(json.error || "Failed to create appointment");
      }
    } catch (err) {
      setError("Failed to create appointment");
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">New Doctor Visit</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Patient *</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  required
                >
                  <option value="">-- Select a patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Healthcare Provider *</label>
                {loadingCaregivers ? (
                  <div className="flex items-center justify-center h-10 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    disabled={!selectedPatientId || assignedCaregivers.length === 0}
                    required
                  >
                    <option value="">
                      {!selectedPatientId 
                        ? "-- Select a patient first --" 
                        : assignedCaregivers.length === 0 
                        ? "-- No caregivers assigned --" 
                        : "-- Select a caregiver --"}
                    </option>
                    {assignedCaregivers.map((caregiver) => (
                      <option key={caregiver.id} value={caregiver.id}>
                        {caregiver.firstName} {caregiver.lastName}
                        {caregiver.email ? ` (${caregiver.email})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Reason for Visit *</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2.5 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Brief description of the visit reason"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Notes (optional)</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2.5 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes"
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Schedule Visit"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
