'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function StaffDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (
      status === 'unauthenticated' ||
      (session?.user?.role !== 'STAFF' && session?.user?.role !== 'ADMIN')
    ) {
      router.push('/dashboard')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Staff Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Clients</h2>
            <p className="text-gray-600 mb-4">View and manage your assigned clients</p>
            <Link href="/staff/clients" className="text-blue-600 hover:text-blue-800">
              View Clients →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule</h2>
            <p className="text-gray-600 mb-4">View your consultations and appointments</p>
            <Link href="/staff/schedule" className="text-blue-600 hover:text-blue-800">
              View Schedule →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Reports</h2>
            <p className="text-gray-600 mb-4">Upload client progress updates</p>
            <Link href="/staff/reports" className="text-blue-600 hover:text-blue-800">
              View Reports →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
