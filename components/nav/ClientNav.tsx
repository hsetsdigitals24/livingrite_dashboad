"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare, 
  LibraryBig,
} from "lucide-react";

/**
 * Client Navigation Links
 * Key sections for family members managing patient care
 */
export function ClientNav() {
  const navItems = [
    {
      label: "Blog",
      href: "/blog",
      icon: LibraryBig,
    },
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

export default ClientNav;
