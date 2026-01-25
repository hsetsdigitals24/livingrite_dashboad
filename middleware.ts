import { withAuth } from "next-auth/middleware"
import { NextRequest } from "next/server"

export const middleware = withAuth(
  function middleware(request: NextRequest & { nextauth: any }) {
    const token = request.nextauth.token
    const pathname = request.nextUrl.pathname

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return new Response("Unauthorized", { status: 403 })
      }
    }

    // Staff routes
    if (pathname.startsWith("/staff")) {
      if (token?.role !== "STAFF" && token?.role !== "ADMIN") {
        return new Response("Unauthorized", { status: 403 })
      }
    }

    // Client routes (requires login)
    if (pathname.startsWith("/client")) {
      if (!token) {
        return new Response("Unauthorized", { status: 403 })
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const protectedRoutes = [
          "/admin",
          "/staff",
          "/client",
          "/dashboard",
        ]
        const isProtected = protectedRoutes.some((route) =>
          req.nextUrl.pathname.startsWith(route)
        )

        if (isProtected) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*", "/client/:path*", "/dashboard"],
}
