import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export const middleware = withAuth(
  function middleware(request) {
    const token = request.nextauth.token
    const pathname = request.nextUrl.pathname

    // Auth pages that should only be accessible by unauthenticated users
    const authPages = ["/auth/signin", "/auth/signup", "/auth/forgot-password", "/auth/reset-password", "/auth/admin"]
    const isAuthPage = authPages.some((page) => pathname === page || pathname.startsWith(page + "/"))

    // Special check for reset-password with token
    const isResetPasswordWithToken = pathname.match(/^\/auth\/reset-password\/[^/]+$/)

    // Prevent authenticated users from accessing auth pages
    if ((isAuthPage || isResetPasswordWithToken) && token) {
      return NextResponse.redirect(new URL(getRedirectUrlByRole(token.role), request.url))
    }

    // Allow unauthenticated users to access auth pages
    if ((isAuthPage || isResetPasswordWithToken) && !token) {
      return NextResponse.next()
    }

    // Protect routes based on user role
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/signin", request.url))
      }
    }

    if (pathname.startsWith("/caregiver")) {
      if (!token || token.role !== "CAREGIVER") {
        return NextResponse.redirect(new URL("/auth/signin", request.url))
      }
    }

    if (pathname.startsWith("/client")) {
      if (!token || token.role !== "CLIENT") {
        return NextResponse.redirect(new URL("/auth/signin", request.url))
      }
    }

    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", request.url))
      }
      // Redirect /dashboard to role-specific dashboard
      if (pathname === "/dashboard") {
        return NextResponse.redirect(new URL(getRedirectUrlByRole(token.role), request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        const authPages = ["/auth/signin", "/auth/signup", "/auth/forgot-password", "/auth/reset-password", "/auth/admin"]
        const isAuthPage = authPages.some((page) => pathname === page || pathname.startsWith(page + "/"))
        const isResetPasswordWithToken = pathname.match(/^\/auth\/reset-password\/[^/]+$/)

        // Allow auth pages without token
        if (isAuthPage || isResetPasswordWithToken) {
          return true
        }

        // Require token for all other protected routes
        return !!token
      },
    },
  }
)

/**
 * Redirects users to their role-specific page
 */
function getRedirectUrlByRole(role: string | undefined): string {
  switch (role) {
    case "ADMIN":
      return "/admin"
    case "CAREGIVER":
      return "/caregiver"
    case "CLIENT":
      return "/client"
    default:
      return "/auth/signin"
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/caregiver/:path*",
    "/client/:path*",
    "/dashboard/:path*",
    "/auth/:path*",
  ],
}