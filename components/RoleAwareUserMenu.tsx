"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { User, LogOut, Settings, ArrowRight } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { RoleBadge } from "./RoleBadge";

/**
 * Role-Aware User Menu Component
 * Displays user info, role badge, and role-specific actions
 */
export function RoleAwareUserMenu() {
  const { role, email, name, isAuthenticated } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  if (!isAuthenticated) {
    return null;
  }

  // Get role-specific dashboard URL
  const getDashboardUrl = () => {
    switch (role) {
      case "ADMIN":
        return "/admin";
      case "CAREGIVER":
        return "/caregiver";
      case "CLIENT":
        return "/client";
      default:
        return "/";
    }
  };

  // Get initial letter for avatar
  const avatarInitial = name?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase() || "U";

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white transition-transform hover:scale-110 active:scale-95"
        aria-label="User menu"
        aria-expanded={isOpen}
        title={email || "User menu"}
      >
        <span className="font-semibold">{avatarInitial}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg">
          {/* User Info Section */}
          <div className="border-b border-gray-200 px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{name || "User"}</p>
                <p className="text-xs text-gray-500">{email}</p>
              </div>
              <RoleBadge role={role} />
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Dashboard Link */}
            <a
              href={getDashboardUrl()}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <ArrowRight className="h-4 w-4" />
              <span>Go to Dashboard</span>
            </a>

            {/* Settings */}
            <a
              href={`${getDashboardUrl()}?section=settings`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </a>

            {/* Profile */}
            <a
              href={`${getDashboardUrl()}?section=profile`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </a>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 py-2">
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
              className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <div className="flex items-center gap-3">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleAwareUserMenu;
