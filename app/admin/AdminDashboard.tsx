"use client";

import { useState } from "react"; 
import ConsultationsSection from "./sections/Consultations";
import ClientsSection from "./sections/Clients";
import Sidebar from "./components/Sidebar";
import PatientsSection from "./sections/Patients";
import CaregiversSection from "./sections/Caregivers";
import MetricCard from "./components/MetricCard";
import SettingsSection from "./sections/Settings"; 
import Header from "./components/Header";
import OverviewSection from "./sections/Overview";
import PipelineSection from "./sections/Pipeline";
import TicketsSection from "./sections/Tickets";
import InvoicesSection from "./sections/Invoices";

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
            {activeSection === "pipeline" && <PipelineSection />}
            {activeSection === "consultations" && <ConsultationsSection />}
            {activeSection === "clients" && <ClientsSection />}
            {activeSection === "patients" && <PatientsSection />}
            {activeSection === "caregivers" && <CaregiversSection />}
            {activeSection === "invoices" && <InvoicesSection />}
            {activeSection === "tickets" && <TicketsSection />}
            {activeSection === "settings" && <SettingsSection />}
            {activeSection === "overview" && <OverviewSection />}
            {/* {activeSection === "revenue" && <RevenueSection />} */}
            {/* {activeSection === "analytics" && <AnalyticsSection />} */} 
          </div>
        </main>
    </div>
      </div>
  );
}