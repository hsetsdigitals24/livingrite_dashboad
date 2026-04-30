"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Heart,
  TrendingUp,
  BarChart3,
  Settings,
  Briefcase,
} from "lucide-react";

/**
 * Admin Navigation Links
 * Dashboard sections for administrative tasks
 */
export function AdminNav() {
  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Patients",
      href: "/admin?section=patients",
      icon: Heart,
    },
    {
      label: "Caregivers",
      href: "/admin?section=caregivers",
      icon: Users,
    },
    {
      label: "Clients",
      href: "/admin?section=clients",
      icon: Briefcase,
    },
    {
      label: "Consultations",
      href: "/admin?section=consultations",
      icon: BarChart3,
    },
    {
      label: "Revenue",
      href: "/admin?section=revenue",
      icon: TrendingUp,
    },
    {
      label: "Analytics",
      href: "/admin?section=analytics",
      icon: BarChart3,
    },
    {
      label: "Settings",
      href: "/admin?section=settings",
      icon: Settings,
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

export default AdminNav;
