"use client";

import Link from "next/link";
import {
  Stethoscope,
  Users,
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface CombinedNavProps {
  role?: string | undefined | null;
}

/**
 * Combined Navigation Component
 * Shows public nav items at all times
 * Appends role-specific items when authenticated
 */
export function CombinedNav({ role }: CombinedNavProps) {
  // Public navigation items - shown to all users
  

  // Caregiver-specific items (shown when role is CAREGIVER)
  const caregiverItems = [
    {
      label: "Dashboard",
      href: "/caregiver",
      icon: LayoutDashboard,
    },
    {
      label: "My Patients",
      href: "/caregiver/patients",
      icon: Users,
    },
    {
      label: "Schedule",
      href: "/caregiver/schedule",
      icon: Calendar,
    },
    {
      label: "Messages",
      href: "/caregiver/messages",
      icon: MessageSquare,
    },
  ];

  // Client-specific items (shown when role is CLIENT)
  const clientItems = [
    {
      label: "Dashboard",
      href: "/client",
      icon: LayoutDashboard,
    },
    {
      label: "My Family",
      href: "/client/patients",
      icon: Users,
    },
    {
      label: "Book Service",
      href: "/client/booking",
      icon: Calendar,
    },
    {
      label: "Messages",
      href: "/client/messages",
      icon: MessageSquare,
    },
  ];

  // Combine items based on role
  let itemsToShow:any[] = []

  if (role === "CAREGIVER") {
    itemsToShow = [...caregiverItems];
  } else if (role === "CLIENT") {
    itemsToShow = [...clientItems];
  }

  return (
    <nav className="hidden items-center gap-1 md:flex mx-auto w-fit">
      {itemsToShow.map((item, index) => {
        const Icon = item.icon;
        // Add visual separator between public and role-specific items
        
        return (
          <div key={item.label} className="flex items-center gap-1">
            
            <Link
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                role && role !== "ADMIN"
                  ? "text-white hover:bg-gray-100 hover:text-gray-900"
                  : "text-white relative hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-teal-500 after:to-cyan-500 after:transition-all after:duration-300 hover:after:w-full"
              }`}
            >
              {role && role !== "ADMIN" && <Icon className="h-4 w-4" />}
              <span>{item.label}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

export default CombinedNav;
