

"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Activity,
  Clock,
} from "lucide-react";
import MetricCard from "../components/MetricCard";

interface DashboardData {
  totalClients: number;
  totalPatients: number;
  totalBookings: number;
  totalRevenue: number;
  bookingsByStatus: Array<{ status: string; count: number }>;
  recentBookings: Array<{
    id: string;
    eventTitle: string;
    status: string;
    scheduledAt: string;
    amount?: number;
  }>;
  bookingsTrend: Array<{ date: string; count: number }>;
  patientsByGender: Array<{ gender: string; count: number }>;
  topServices: Array<{ service: string; bookings: number }>;
  loading: boolean;
  error: string | null;
}

const OverviewSection = () => {
  const [data, setData] = useState<DashboardData>({
    totalClients: 0,
    totalPatients: 0,
    totalBookings: 0,
    totalRevenue: 0,
    bookingsByStatus: [],
    recentBookings: [],
    bookingsTrend: [],
    patientsByGender: [],
    topServices: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const result = await response.json();
        setData((prev) => ({
          ...prev,
          ...result,
          loading: false,
        }));
      } catch (err) {
        setData((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "An error occurred",
          loading: false,
        }));
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ["#12ccda", "#f762be", "#10b981", "#f59e0b", "#8b5cf6"];

  if (data.loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's your platform's performance at a glance.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Clients"
          value={data.totalClients}
          icon={Users}
          color="blue"
        />
        <MetricCard
          label="Total Patients"
          value={data.totalPatients}
          icon={Activity}
          color="green"
        />
        <MetricCard
          label="Total Bookings"
          value={data.totalBookings}
          icon={Calendar}
          color="purple"
        />
        <MetricCard
          label="Total Revenue"
          value={`₦${data.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Status */}
        {data.bookingsByStatus.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bookings by Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={80}
                  fill=""
                  dataKey="count"
                >
                  {data.bookingsByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Patients by Gender */}
        {data.patientsByGender.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Patients by Gender
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.patientsByGender}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#12ccda" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Bookings Trend */}
      {data.bookingsTrend.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bookings Trend (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.bookingsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#00b2ec"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Bookings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Services */}
      {data.topServices.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Services
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topServices} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="service" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#10b981" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Bookings Table */}
      {data.recentBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Bookings
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Event
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Scheduled At
                  </th>
                  {data.recentBookings.some((b) => b.amount) && (
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {booking.eventTitle || "Consultation"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "SCHEDULED"
                            ? "bg-blue-100 text-blue-800"
                            : booking.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(booking.scheduledAt).toLocaleDateString()}
                    </td>
                    {data.recentBookings.some((b) => b.amount) && (
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {booking.amount ? `₦${booking.amount.toLocaleString()}` : "—"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading dashboard: {data.error}
        </div>
      )}
    </div>
  );
};

export default OverviewSection;