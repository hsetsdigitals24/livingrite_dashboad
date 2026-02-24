"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  biologicalGender: string;
  heightCm: number;
  weightKg: number;
  medicalConditions: string[];
  medications: any[];
  emergencyContact: string;
  emergencyPhone: string;
  timezone: string;
}

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [newCondition, setNewCondition] = useState("");
  const [newMedication, setNewMedication] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    biologicalGender: "",
    heightCm: "",
    weightKg: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    medicalConditions: [] as string[],
    medications: JSON.stringify([]),
    emergencyContact: "",
    emergencyPhone: "",
  });

  // Fetch patient data on mount
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/client/patients/${patientId}`);
        if (!response.ok) {
          setError("Failed to fetch patient details");
          return;
        }
        const data = await response.json();
        setPatient(data);

        // Populate form data
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth
            ? data.dateOfBirth.split("T")[0]
            : "",
          biologicalGender: data.biologicalGender || "",
          heightCm: data.heightCm?.toString() || "",
          weightKg: data.weightKg?.toString() || "",
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          medicalConditions: data.medicalConditions || [],
          medications: JSON.stringify(data.medications || []),
          emergencyContact: data.emergencyContact || "",
          emergencyPhone: data.emergencyPhone || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, newCondition.trim()],
      }));
      setNewCondition("");
    }
  };

  const handleRemoveCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter((_, i) => i !== index),
    }));
  };

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      try {
        const medications = JSON.parse(formData.medications || "[]");
        medications.push(newMedication.trim());
        setFormData((prev) => ({
          ...prev,
          medications: JSON.stringify(medications),
        }));
        setNewMedication("");
      } catch {
        setError("Invalid medication format");
      }
    }
  };

  const handleRemoveMedication = (index: number) => {
    try {
      const medications = JSON.parse(formData.medications || "[]");
      medications.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        medications: JSON.stringify(medications),
      }));
    } catch {
      setError("Invalid medication format");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return;
    }

    try {
      setSaving(true);

      // Parse medications
      let medications = null;
      try {
        medications = JSON.parse(formData.medications);
      } catch {
        medications = null;
      }

      const response = await fetch(`/api/client/patients/${patientId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          dateOfBirth: formData.dateOfBirth || null,
          biologicalGender: formData.biologicalGender || null,
          heightCm: formData.heightCm ? parseFloat(formData.heightCm) : null,
          weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
          timezone: formData.timezone,
          medicalConditions: formData.medicalConditions,
          medications,
          emergencyContact: formData.emergencyContact || null,
          emergencyPhone: formData.emergencyPhone || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update patient");
      }

      setSuccess("Patient information updated successfully!");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/client/patients/${patientId}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error updating patient:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Patient
      </button>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Patient Information
          </h1>
          <p className="text-gray-600 mt-1">
            {patient?.firstName} {patient?.lastName}
          </p>
        </div>

        {error && (
          <div className="p-4 m-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 m-6 bg-green-50 border border-green-200 rounded-lg text-green-700 flex gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Biological Gender
                </label>
                <select
                  name="biologicalGender"
                  value={formData.biologicalGender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Medical Information
            </h2>

            {/* Medical Conditions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Medical Conditions
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCondition();
                    }
                  }}
                  placeholder="Add a condition"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.medicalConditions.map((condition, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-red-50 p-3 rounded-lg"
                  >
                    <span className="text-red-800">{condition}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(idx)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Medications
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMedication();
                    }
                  }}
                  placeholder="Add a medication"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {(() => {
                  try {
                    const meds = JSON.parse(formData.medications || "[]");
                    return meds.map((med: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                      >
                        <span className="text-blue-800">{med}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(idx)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ));
                  } catch {
                    return null;
                  }
                })()}
              </div>
            </div>
          </div>

          {/* Emergency Information */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Emergency Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t pt-6 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
 