"use client";

import { useState, lazy, Suspense } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Lazy-load all sections — only the active one is ever downloaded
const ConsultationsSection = lazy(() => import("./sections/Consultations"));
const ClientsSection = lazy(() => import("./sections/Clients"));
const PatientsSection = lazy(() => import("./sections/Patients"));
const CaregiversSection = lazy(() => import("./sections/Caregivers"));
const SettingsSection = lazy(() => import("./sections/Settings"));
const OverviewSection = lazy(() => import("./sections/Overview"));
const PipelineSection = lazy(() => import("./sections/Pipeline"));
const TicketsSection = lazy(() => import("./sections/Tickets"));
const InvoicesSection = lazy(() => import("./sections/Invoices"));
const ReportsSection = lazy(() => import("./sections/Reports"));
const CaseStudiesSection = lazy(() => import("./sections/CaseStudies"));
const CaregiverAllowList = lazy(() => import("./sections/CaregiverAllowList"));

function SectionFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
            <Suspense fallback={<SectionFallback />}>
              {activeSection === "pipeline" && <PipelineSection />}
              {activeSection === "consultations" && <ConsultationsSection />}
              {activeSection === "clients" && <ClientsSection />}
              {activeSection === "patients" && <PatientsSection />}
              {activeSection === "caregivers" && <CaregiversSection />}
              {activeSection === "caregiver-allow-list" && <CaregiverAllowList />}
              {activeSection === "invoices" && <InvoicesSection />}
              {activeSection === "tickets" && <TicketsSection />}
              {activeSection === "case-studies" && <CaseStudiesSection />}
              {activeSection === "settings" && <SettingsSection />}
              {activeSection === "reports" && <ReportsSection />}
              {activeSection === "overview" && <OverviewSection />}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}