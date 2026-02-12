"use client";

import Link from "next/link";
import { Users, Calendar, MessageSquare, LayoutDashboard } from "lucide-react";

/**
 * Caregiver Navigation Links
 * Key sections for caregiver daily tasks
 */
export function CaregiverNav() {
  const navItems = [
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

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default CaregiverNav;
