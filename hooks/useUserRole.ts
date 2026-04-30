"use client";

import { useSession } from "next-auth/react";

export type UserRole = "ADMIN" | "CAREGIVER" | "CLIENT" | null;

export interface UseUserRoleReturn {
  role: UserRole;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCaregiver: boolean;
  isClient: boolean;
  email?: string | null;
  name?: string | null;
}

/**
 * Hook to safely retrieve current user's role and authentication status
 * Works on client side with NextAuth sessions
 * 
 * @returns User role, authentication state, and role-specific flags
 * 
 * @example
 * const { role, isAdmin, isAuthenticated } = useUserRole();
 * 
 * if (isAdmin) {
 *   // Show admin-only components
 * }
 */
export function useUserRole(): UseUserRoleReturn {
  const { data: session, status } = useSession();

  const role = (session?.user?.role as UserRole) || null;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return {
    role,
    isLoading,
    isAuthenticated,
    isAdmin: role === "ADMIN",
    isCaregiver: role === "CAREGIVER",
    isClient: role === "CLIENT",
    email: session?.user?.email,
    name: session?.user?.name,
  };
}

export default useUserRole;
