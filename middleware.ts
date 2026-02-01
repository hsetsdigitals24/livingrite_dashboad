import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export const middleware = withAuth(
  function middleware(request) {
    const token = request.nextauth.token
    const pathname = request.nextUrl.pathname

    // Allow unauthenticated access to auth pages
    if (pathname.startsWith("/auth/")) {
      return NextResponse.next()
    }

    // Redirect unauthenticated users from root to signin
    // if (pathname === "/" && !token) {
    //   return NextResponse.redirect(new URL("/auth/signin", request.url))
    // }

    // Redirect authenticated users away from signin page
    if (pathname === "/auth/signin" && token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Redirect admin users from /dashboard to /dashboard/admin
    if (pathname === "/dashboard" && token?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url))
    }

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/signin", request.url))
      }
    }

    // Protect staff routes
    if (pathname.startsWith("/staff")) {
      if (!token || (token.role !== "STAFF" && token.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/auth/signin", request.url))
      }
    }

    // Protect dashboard and client routes
    if ((pathname.startsWith("/dashboard") || pathname.startsWith("/client")) && !token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow auth pages without token
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true
        }
        // Require token for all other protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/client/:path*",
    "/dashboard/:path*",
    "/auth/:path*",
  ],
}
