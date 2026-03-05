"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddFamilyMemberForm from "@/app/client/components/AddFamilyMemberForm";
import BookingModal from "@/app/client/components/BookingModal";
import DoctorAppointmentModal from "@/components/caregiver/DoctorAppointmentModal";
import {
  Calendar,
  FileText,
  Plus,
  Users,
  Clock,
  AlertCircle,
  User2Icon,
} from "lucide-react";

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
    bookings?: Array<{
      id: string;
      scheduledAt: string;
      status: string;
      service?: { title: string };
    }>;
  };
  relationshipType: string;
}

const ClientDashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [error, setError] = useState("");
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
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

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const res = await fetch("/api/client/doctor-appointments");
      const json = await res.json();
      if (json.success) setAppointments(json.data);
    } catch (err) {
      console.error("failed to load appointments", err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleAddPatientSuccess = () => {
    setShowAddPatientModal(false);
    fetchPatients();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto animate-pulse space-y-8">
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-white rounded-2xl shadow-sm"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const upcoming = patients
    .flatMap((item) =>
      (item.patient.bookings ?? []).map((b) => ({
        ...b,
        patientName: `${item.patient.firstName} ${item.patient.lastName}`,
      })),
    )
    .filter((b) => new Date(b.scheduledAt) > new Date())
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );

  const upcomingAppointments = appointments
    .filter((a) => new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex justify-between items-start gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 leading-tight">
                Family Health Dashboard
              </h1>
              <p className="text-indigo-100 text-lg">
                Manage and monitor your loved ones' health records
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              <Link
                href="/client/invoices"
                className="group inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm border border-white/30 hover:border-white/50"
              >
                <FileText className="w-5 h-5" />
                Invoices
              </Link>
              <button
                onClick={() => setShowBookingModal(true)}
                className="group inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm border border-white/30 hover:border-white/50"
              >
                <Calendar className="w-5 h-5" />
                Book Consultation
              </button>
              <button
                onClick={() => setShowDoctorModal(true)}
                className="group inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm border border-white/30 hover:border-white/50"
              >
                <Clock className="w-5 h-5" />
                Log Doctor Visit
              </button>
              {patients.length >= 1 && (
                <button
                  onClick={() => setShowAddPatientModal(true)}
                  className="group inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm border border-white/30 hover:border-white/50"
                >
                  <Plus className="w-5 h-5" />
                  Add Family Member
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Upcoming Appointments */}
        {upcoming.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </span>
              Upcoming Appointments
            </h2>
            <div className="space-y-3">
              {upcoming.map((b) => (
                <div
                  key={b.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">
                        {b.patientName}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(b.scheduledAt).toLocaleString()}
                      </p>
                      {b.service && (
                        <p className="text-sm text-indigo-600 font-medium mt-1">
                          {b.service.title}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                        b.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : b.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {b.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Doctor Visits */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </span>
              Upcoming Doctor Visits
            </h2>
            <div className="space-y-3">
              {upcomingAppointments.map((a) => (
                <div
                  key={a.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-purple-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">
                        {a.patient?.firstName} {a.patient?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(a.date).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-gray-700">
                          <span className="font-medium">Provider:</span>{" "}
                          {a.provider}
                        </span>
                        <span className="text-sm text-gray-700">
                          <span className="font-medium">Reason:</span>{" "}
                          {a.reason}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-red-700 font-semibold">Error</p>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Family Members Grid */}
        {patients.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-16 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-6">
              No family members added yet
            </p>
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add Your First Family Member
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {patients.map((item) => (
              <Link
                key={item.patient.id}
                href={`/client/patients/${item.patient.id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 overflow-hidden hover:-translate-y-1"
              >
                {/* <div className="bg-gradient-to-r from-primary to-accent h-8"></div> */}
                <div className="p-6 relative">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-slate-600 flex items-center gap-2">
                      <User2Icon className="w-5 h-5 text-indigo-500 inline-block mr-2" />
                      {item.patient.firstName} {item.patient.lastName}
                    </h2>
                    <p className="text-sm text-indigo-600 font-semibold capitalize mt-1">
                      {item.relationshipType}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    {item.patient.email && (
                      <p className="text-sm text-gray-600 truncate">
                        <span className="font-medium text-gray-700">
                          Email:
                        </span>
                        <br />
                        {item.patient.email}
                      </p>
                    )}
                    {item.patient.phone && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">
                          Phone:
                        </span>
                        <br />
                        {item.patient.phone}
                      </p>
                    )}
                  </div>

                  {item.patient.medicalConditions.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Medical Conditions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.patient.medicalConditions.map(
                          (condition, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-gradient-to-r from-red-50 to-orange-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200"
                            >
                              {condition}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <p className="text-sm text-indigo-600 font-semibold group-hover:text-indigo-700 flex items-center gap-2">
                      View Details
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddPatientModal && (
        <AddFamilyMemberForm
          onClose={() => setShowAddPatientModal(false)}
          onSuccess={handleAddPatientSuccess}
        />
      )}

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        patients={patients.map((item) => ({
          id: item.patient.id,
          firstName: item.patient.firstName,
          lastName: item.patient.lastName,
          email: item.patient.email,
        }))}
      />

      <DoctorAppointmentModal
        isOpen={showDoctorModal}
        onClose={() => setShowDoctorModal(false)}
        onSuccess={fetchAppointments}
        postUrl="/api/client/doctor-appointments"
      />
    </div>
  );
};

export default ClientDashboard;
