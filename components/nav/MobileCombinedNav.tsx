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

interface MobileCombinedNavProps {
  role?: string | undefined | null;
  onLinkClick: () => void;
}

/**
 * Mobile Combined Navigation Component
 * Shows public nav items at all times
 * Appends role-specific items when authenticated
 */
export function MobileCombinedNav({ role, onLinkClick }: MobileCombinedNavProps) {
  // Public navigation items
  const publicItems = [
    {
      label: "Services",
      href: "/services",
      icon: Stethoscope,
    },
    {
      label: "About",
      href: "/about",
      icon: Users,
    },
    {
      label: "Testimonials",
      href: "/testimonials",
      icon: BookOpen,
    },
    {
      label: "Blogs",
      href: "/blog",
      icon: BookOpen,
    },
    {
      label: "FAQs",
      href: "/faqs",
      icon: HelpCircle,
    },
  ];

  // Caregiver-specific items
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

  // Client-specific items
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

  return (
    <div className="flex flex-col gap-2">
      {/* Public Navigation Section */}
      <div className="px-4 py-2">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Services & Info
        </p>
        {publicItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onLinkClick}
              className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700 text-sm"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Role-Specific Navigation Section */}
      {(role === "CAREGIVER" || role === "CLIENT") && (
        <div className="border-t border-gray-200 px-4 py-2">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            {role === "CAREGIVER" ? "My Tasks" : "Family Portal"}
          </p>
          {(role === "CAREGIVER" ? caregiverItems : clientItems).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onLinkClick}
                className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700 text-sm"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MobileCombinedNav;
