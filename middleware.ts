import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ token }) {
      // This runs on every request
      // Return true if user is authorized
      return !!token;
    },
  },
});

// Specify which routes to run middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/portal/:path*', '/admin/:path*'],
};
