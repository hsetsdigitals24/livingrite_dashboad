'use client';

import { useSession, signOut } from 'next-auth/react'; 
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">LivingRite</h1>
          <button
            onClick={() => signOut({ redirect: true, redirectTo: '/auth/login' })}
            className="text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome, {session?.user?.name}!
          </h2>
          <p className="text-gray-600 mb-6">
            {`You're logged in as a ${session?.user?.role.replace('_', ' ')}.`}
          </p>
          <p className="text-gray-500 text-sm">
            Phase 1 - Foundation setup. Feature modules coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
