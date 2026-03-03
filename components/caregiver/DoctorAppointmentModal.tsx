"use client";

import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";

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
  const [date, setDate] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) fetchPatients();
  }, [isOpen]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/caregiver/patients");
      const json = await res.json();
      if (json.patients) {
        setPatients(json.patients.map((p: any) => ({ id: p.id, firstName: p.firstName, lastName: p.lastName })));
      } else {
        setError(json.error || "Failed to load patients");
      }
    } catch (err) {
      setError("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPatientId || !date || !provider || !reason) {
      setError("Please fill out all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const endpoint = postUrl || "/api/caregiver/doctor-appointments";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: selectedPatientId, date, provider, reason, notes }),
      });
      const json = await res.json();
      if (json.success) {
        setError("");
        onSuccess && onSuccess();
        onClose();
      } else {
        setError(json.error || "Failed to create appointment");
      }
    } catch (err) {
      setError("Failed to create appointment");
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
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">Patient</label>
                <select
                  className="w-full border-gray-300 rounded p-2"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                >
                  <option value="">-- choose --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full border-gray-300 rounded p-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Provider</label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded p-2"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Reason</label>
                <textarea
                  className="w-full border-gray-300 rounded p-2 h-24"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Notes (optional)</label>
                <textarea
                  className="w-full border-gray-300 rounded p-2 h-24"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Schedule"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
