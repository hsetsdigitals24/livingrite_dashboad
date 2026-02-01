"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  X,
} from "lucide-react";
import ConsultationsSection from "./sections/Consultations";
import ClientsSection from "./sections/Clients";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      redirect("/auth/signin");
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-900">LivingRite Admin</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
          <nav className="p-6 space-y-2">
            {[
              { label: "Dashboard", icon: BarChart3, id: "overview" },
              { label: "Consultations", icon: Calendar, id: "consultations" },
              { label: "Clients", icon: Users, id: "clients" },
              { label: "Revenue", icon: DollarSign, id: "revenue" },
              { label: "Analytics", icon: TrendingUp, id: "analytics" },
              { label: "Tickets", icon: MessageSquare, id: "tickets" },
              { label: "Settings", icon: Settings, id: "settings" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {activeSection === "overview" && <OverviewSection />}
            {activeSection === "consultations" && <ConsultationsSection />}
            {activeSection === "clients" && <ClientsSection />}
            {/* {activeSection === "revenue" && <RevenueSection />}
            {activeSection === "analytics" && <AnalyticsSection />} */}
            {activeSection === "tickets" && <TicketsSection />}
            {activeSection === "settings" && <SettingsSection />}
          </div>
        </main>
      </div>
    </div>
  );
}

// Overview Section
function OverviewSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Here's what's happening with your business today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Revenue"
          value="₦2,450,000"
          change="+12.5%"
          icon={DollarSign}
          positive
        />
        <MetricCard
          label="Consultations"
          value="847"
          change="+8.2%"
          icon={Calendar}
          positive
        />
        <MetricCard
          label="Active Clients"
          value="342"
          change="+5.1%"
          icon={Users}
          positive
        />
        <MetricCard
          label="Conversion Rate"
          value="24.5%"
          change="-2.3%"
          icon={TrendingUp}
          positive={false}
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <select className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700 border border-gray-300">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-b from-indigo-50 to-transparent rounded-lg flex items-end justify-around p-4">
            {[65, 78, 90, 72, 88, 95, 110].map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t mx-1"
                style={{ height: `${(val / 110) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Inquiries</span>
                <span className="text-sm font-semibold text-gray-900">156</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Consultations</span>
                <span className="text-sm font-semibold text-gray-900">89</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "57%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Proposals</span>
                <span className="text-sm font-semibold text-gray-900">54</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "35%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Active Clients</span>
                <span className="text-sm font-semibold text-gray-900">38</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "24%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Consultations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Consultations</h3>
          <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Client</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Service</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { client: "Chioma Obi", service: "Home Care", date: "Today", status: "completed" },
                { client: "Amara Hassan", service: "Nursing", date: "Yesterday", status: "completed" },
                { client: "Tunde Adeyemi", service: "Consultation", date: "2 days ago", status: "pending" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-medium text-gray-900">{row.client}</td>
                  <td className="px-4 py-4 text-gray-600">{row.service}</td>
                  <td className="px-4 py-4 text-gray-600">{row.date}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



// Placeholder Sections
 
function RevenueSection() {
  return <div className="text-gray-600">Revenue section coming soon...</div>;
}

function AnalyticsSection() {
  return <div className="text-gray-600">Analytics section coming soon...</div>;
}

function TicketsSection() {
  return <div className="text-gray-600">Tickets section coming soon...</div>;
}

function SettingsSection() {
  return <div className="text-gray-600">Settings section coming soon...</div>;
}

// Metric Card Component
function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  icon: any;
  positive: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <span className={`text-sm font-medium flex items-center gap-1 ${positive ? "text-green-600" : "text-red-600"}`}>
          {positive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {change}
        </span>
      </div>
    </div>
  );
}
