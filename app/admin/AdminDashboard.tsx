"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign
} from "lucide-react";
import ConsultationsSection from "./sections/Consultations";
import ClientsSection from "./sections/Clients";
import Sidebar from "./components/Sidebar";
import PatientsSection from "./sections/Patients";
import CaregiversSection from "./sections/Caregivers";
import MetricCard from "./components/MetricCard";
import SettingsSection from "./sections/Settings"; 
import Header from "./components/Header";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {activeSection === "consultations" && <ConsultationsSection />}
            {activeSection === "clients" && <ClientsSection />}
            {activeSection === "patients" && <PatientsSection />}
            {activeSection === "caregivers" && <CaregiversSection />}
            {activeSection === "settings" && <SettingsSection />}
            {/* {activeSection === "overview" && <OverviewSection />} */}
            {/* {activeSection === "revenue" && <RevenueSection />} */}
            {/* {activeSection === "analytics" && <AnalyticsSection />} */}
            {/* {activeSection === "tickets" && <TicketsSection />} */}
          </div>
        </main>
    </div>
      </div>
  );
}