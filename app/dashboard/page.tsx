"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  FileText,
  Heart,
  Home,
  MessageSquare,
  Receipt,
  Settings,
  User,
  Activity
} from "lucide-react"; 
import Overview from "./sections/Overview";
import Sidebar from "./components/Sidebar";

 

const navigationItems = [
  { name: "Overview", icon: Home, href: "overview", active: true },
  { name: "Care Updates", icon: Heart, href: "care-updates" },
  { name: "Health Logs", icon: Activity, href: "health-logs" },
  { name: "Photos & Videos", icon: User, href: "media" },
  { name: "Invoices", icon: Receipt, href: "invoices" },
  { name: "Care Plans", icon: FileText, href: "care-plans" },
  { name: "Messages", icon: MessageSquare, href: "messages" },
  { name: "Documents", icon: FileText, href: "documents" },
  { name: "Appointments", icon: Calendar, href: "appointments" },
  { name: "Settings", icon: Settings, href: "settings" },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "CLIENT") {
      redirect("/auth/signin");
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "CLIENT") {
    return null;
  }

  return (
    <div className="min-h-[100%] w-[75%] mx-auto bg-gray-50 relative flex border border-gray-50 rounded-lg shadow-lg mt-4">
      {/* Sidebar */}
    <Sidebar navigationItems={navigationItems} setActiveSection={setActiveSection} activeSection={activeSection} name={session?.user?.name!} />

    {/* Main Content */}
      <div
        className="p-8 scrollbar-hide overflow-y-auto"
        style={{ height: "calc(200vh - 2rem)" }}
      >
        {BreadCrumb(
          activeSection.charAt(0).toUpperCase() +
            activeSection.slice(1).replace("-", " "),
        )} 
     {(() => {
      switch(activeSection){
        case "overview":
          return <Overview user={session.user.name} />;
        // case "care-updates":
        //   return <CareUpdates />;
        // case "health-logs":
        //   return <HealthLogs />;
        // case "media":
        //   return <Media />;
        // case "invoices":
        //   return <Invoices />;
        // case "care-plans":
        //   return <CarePlans />;
        // case "messages":
        //   return <Messages />;
        // case "documents":
        //   return <Documents />;
        // case "appointments":
        //   return <Appointments />;
        // case "settings":
        //   return <Settings /
        default:
          return <Overview user={session.user.name} />;
      } 
     })()}
      </div>
    </div>
  );
}

const BreadCrumb = (section: string) => {
  return (
    <div className="text-sm text-gray-500 mb-4">
      Home <span className="text-primary">/</span> Dashboard <span className="text-primary">/</span> {" "}
      <span className="text-gray-900 font-medium">{section}</span>
    </div>
  );
};
