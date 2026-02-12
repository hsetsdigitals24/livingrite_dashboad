"use client";

import { UserRole } from "@/hooks/useUserRole";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

/**
 * Role Badge Component
 * Displays user's role with color-coded styling
 * - Admin: Purple
 * - Caregiver: Blue
 * - Client: Green
 */
export function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  if (!role) return null;

  const roleConfig = {
    ADMIN: {
      label: "Admin",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      dotColor: "bg-purple-600",
    },
    CAREGIVER: {
      label: "Caregiver",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      dotColor: "bg-blue-600",
    },
    CLIENT: {
      label: "Family",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      dotColor: "bg-green-600",
    },
  };

  const config = roleConfig[role];

  return (
    <div className={`flex items-center gap-1.5 rounded-full ${config.bgColor} px-3 py-1 ${className}`}>
      <div className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
      <span className={`text-xs font-semibold ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}

export default RoleBadge;
