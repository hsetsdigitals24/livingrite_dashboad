export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/blog",
  "/contact",
  "/faq",
  "/auth/login",
  "/auth/register",
  "/api/auth",
];

export const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
];

export const ROLE_PROTECTED_ROUTES: Record<string, string[]> = {
  ADMIN: ["/admin", "/api/admin"],
  CAREGIVER: ["/caregiver", "/api/caregiver"],
  CLIENT: ["/portal", "/api/portal", "/api/bookings"],
  SUPPORT: ["/support", "/api/support"],
};
