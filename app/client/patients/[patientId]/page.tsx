"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

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
  vitals: any[];
  dailyLogs: any[];
  labResults: any[];
  medicalAppointments: any[];
  bookings: any[];
  files: any[];
  caregivers: any[];
}

const PatientDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/client/patients/${patientId}`);
        if (!response.ok) {
          if (response.status === 403) {
            setError("You do not have access to this patient's records");
          } else {
            throw new Error("Failed to fetch patient details");
          }
          return;
        }
        const data = await response.json();
        setPatient(data);
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

  if (error || !patient) {
    return (
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          {error || "Patient not found"}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "vitals", label: "Vitals" },
    { id: "daily-logs", label: "Daily Logs" },
    { id: "lab-results", label: "Lab Results" },
    { id: "appointments", label: "Appointments" },
    { id: "bookings", label: "Bookings" },
    { id: "files", label: "Files" },
  ];

  // Prepare vitals data for charts
  const vitalsChartData = patient.vitals
    .slice()
    .reverse()
    .map((vital) => ({
      date: new Date(vital.recordedAt).toLocaleDateString(),
      temperature: vital.temperature,
      heartRate: vital.heartRate,
      bloodPressure: vital.bloodPressure,
    }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-6 text-indigo-600 hover:text-indigo-700 font-medium"
      >
        ← Back to Family Members
      </button>

      {/* Patient Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            {patient.biologicalGender && (
              <p className="text-gray-600 capitalize">{patient.biologicalGender}</p>
            )}
          </div>
          <Link
            href={`/client/patients/${patient.id}/edit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {patient.email && (
            <div>
              <p className="text-sm text-gray-600 font-medium">Email</p>
              <p className="text-gray-900">{patient.email}</p>
            </div>
          )}
          {patient.phone && (
            <div>
              <p className="text-sm text-gray-600 font-medium">Phone</p>
              <p className="text-gray-900">{patient.phone}</p>
            </div>
          )}
          {patient.heightCm && (
            <div>
              <p className="text-sm text-gray-600 font-medium">Height</p>
              <p className="text-gray-900">{patient.heightCm} cm</p>
            </div>
          )}
          {patient.weightKg && (
            <div>
              <p className="text-sm text-gray-600 font-medium">Weight</p>
              <p className="text-gray-900">{patient.weightKg} kg</p>
            </div>
          )}
        </div>

        {/* Medical Conditions */}
        {patient.medicalConditions.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <p className="font-medium text-gray-900 mb-3">Medical Conditions</p>
            <div className="flex flex-wrap gap-2">
              {patient.medicalConditions.map((condition, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-red-100 text-red-800 text-sm px-4 py-2 rounded-full"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        {patient.emergencyContact && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium">Emergency Contact</p>
                <p className="text-gray-900">{patient.emergencyContact}</p>
              </div>
              {patient.emergencyPhone && (
                <div>
                  <p className="text-sm text-gray-600 font-medium">Emergency Phone</p>
                  <p className="text-gray-900">{patient.emergencyPhone}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm border-b-2 ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Latest Vitals */}
              {patient.vitals.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Vitals</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {(() => {
                      const latest = patient.vitals[0];
                      return (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Temperature</p>
                            <p className="text-xl font-semibold text-gray-900">{latest.temperature}°C</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Blood Pressure</p>
                            <p className="text-xl font-semibold text-gray-900">{latest.bloodPressure}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Heart Rate</p>
                            <p className="text-xl font-semibold text-gray-900">{latest.heartRate} bpm</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Daily Logs</p>
                  <p className="text-2xl font-bold text-blue-600">{patient.dailyLogs.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Lab Results</p>
                  <p className="text-2xl font-bold text-green-600">{patient.labResults.length}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Appointments</p>
                  <p className="text-2xl font-bold text-purple-600">{patient.medicalAppointments.length}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Bookings</p>
                  <p className="text-2xl font-bold text-orange-600">{patient.bookings.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Vitals Tab */}
          {activeTab === "vitals" && (
            <div className="space-y-6">
              {patient.vitals.length === 0 ? (
                <p className="text-gray-600">No vitals recorded yet</p>
              ) : (
                <>
                  {/* Temperature Chart */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trend</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={vitalsChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis label={{ value: "°C", angle: -90, position: "insideLeft" }} />
                          <Tooltip formatter={(value) => `${value}°C`} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Temperature"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Heart Rate Chart */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Rate Trend</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={vitalsChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis label={{ value: "bpm", angle: -90, position: "insideLeft" }} />
                          <Tooltip formatter={(value) => `${value} bpm`} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="heartRate"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Heart Rate"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Combined Chart */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">All Vitals Overview</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={vitalsChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }} />
                          <YAxis yAxisId="right" orientation="right" label={{ value: "Heart Rate (bpm)", angle: 90, position: "insideRight" }} />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="temperature"
                            stroke="#ef4444"
                            strokeWidth={2}
                            name="Temperature (°C)"
                          />
                          <Bar
                            yAxisId="right"
                            dataKey="heartRate"
                            fill="#3b82f6"
                            name="Heart Rate (bpm)"
                            opacity={0.7}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Vitals Table */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vitals History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Date</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Temperature</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Blood Pressure</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Heart Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patient.vitals.map((vital, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {new Date(vital.recordedAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{vital.temperature}°C</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{vital.bloodPressure}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{vital.heartRate} bpm</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Daily Logs Tab */}
          {activeTab === "daily-logs" && (
            <div className="space-y-4">
              {patient.dailyLogs.length === 0 ? (
                <p className="text-gray-600">No daily logs recorded yet</p>
              ) : (
                patient.dailyLogs.map((log, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {new Date(log.date).toLocaleDateString()}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {log.sleepData && (
                        <div>
                          <p className="text-sm text-gray-600">Sleep</p>
                          <p className="text-gray-900">{log.sleepData.totalSleepMinutes} min</p>
                        </div>
                      )}
                      {log.physicalActivity && (
                        <div>
                          <p className="text-sm text-gray-600">Steps</p>
                          <p className="text-gray-900">{log.physicalActivity.steps || "—"}</p>
                        </div>
                      )}
                      {log.nutritionData && (
                        <div>
                          <p className="text-sm text-gray-600">Calories</p>
                          <p className="text-gray-900">{log.nutritionData.totalCalories}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Lab Results Tab */}
          {activeTab === "lab-results" && (
            <div className="space-y-4">
              {patient.labResults.length === 0 ? (
                <p className="text-gray-600">No lab results recorded yet</p>
              ) : (
                patient.labResults.map((result, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 mb-2">
                      {new Date(result.date).toLocaleDateString()}
                    </p>
                    {result.testResults && (
                      <div className="text-sm text-gray-600">
                        {JSON.stringify(result.testResults, null, 2)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-4">
              {patient.medicalAppointments.length === 0 ? (
                <p className="text-gray-600">No appointments scheduled</p>
              ) : (
                patient.medicalAppointments.map((apt, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{apt.reason}</h4>
                      <p className="text-sm text-gray-600">{new Date(apt.date).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">Provider: {apt.provider}</p>
                    {apt.notes && <p className="text-sm text-gray-600">Notes: {apt.notes}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              {patient.bookings.length === 0 ? (
                <p className="text-gray-600">No bookings found</p>
              ) : (
                patient.bookings.map((booking, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{booking.eventTitle || "Consultation"}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {new Date(booking.scheduledAt).toLocaleDateString()} at{" "}
                      {new Date(booking.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {booking.payment && (
                      <p className="text-sm text-gray-600">
                        Payment: {booking.payment.amount} ({booking.payment.status})
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Files Tab */}
          {activeTab === "files" && (
            <div className="space-y-4">
              {patient.files.length === 0 ? (
                <p className="text-gray-600">No files uploaded</p>
              ) : (
                patient.files.map((file, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{file.originalName}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                      <p className="text-xs text-gray-500">{new Date(file.createdAt).toLocaleDateString()}</p>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Download
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;
 