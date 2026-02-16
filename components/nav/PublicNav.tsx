"use client";

import Link from "next/link";
import {
  Stethoscope,
  Users,
  BookOpen,
  HelpCircle,
  Search,
} from "lucide-react";

/**
 * Public Navigation Links
 * For unauthenticated users and general public
 */
export function PublicNav() {
  const navItems = [
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

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="relative px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-teal-500 after:to-cyan-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default PublicNav;
