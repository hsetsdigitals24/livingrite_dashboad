"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddFamilyMemberForm from "@/app/client/components/AddFamilyMemberForm";

interface Patient {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    image: string;
    dateOfBirth: string;
    medicalConditions: string[];
  };
  relationshipType: string;
}

const ClientDashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/client/patients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatientSuccess = () => {
    setShowAddPatientModal(false);
    fetchPatients();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Family Dashboard</h1>
          <p className="text-gray-600">View and manage your family members' health records</p>
        </div>
        <button
          onClick={() => setShowAddPatientModal(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium"
        >
          + Add Family Member
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {patients.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No family members added yet</p>
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Add Family Member
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((item) => (
            <Link
              key={item.patient.id}
              href={`/client/patients/${item.patient.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {item.patient.firstName} {item.patient.lastName}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">{item.relationshipType}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {item.patient.email && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {item.patient.email}
                  </p>
                )}
                {item.patient.phone && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {item.patient.phone}
                  </p>
                )}
              </div>

              {item.patient.medicalConditions.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Medical Conditions:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.patient.medicalConditions.map((condition, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                  View Details →
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Family Member Modal */}
      {showAddPatientModal && (
        <AddFamilyMemberForm
          onClose={() => setShowAddPatientModal(false)}
          onSuccess={handleAddPatientSuccess}
        />
      )}
    </div>
  );
};

export default ClientDashboard;