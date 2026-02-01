'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import InvitationManager from '@/app/components/InvitationManager'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Invitation Manager */}
        <div className="mb-12">
          <InvitationManager />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
            <p className="text-gray-600 mb-4">Manage users and their roles</p>
            <Link href="/admin/users" className="text-blue-600 hover:text-blue-800">
              View Users →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reports</h2>
            <p className="text-gray-600 mb-4">View system reports and analytics</p>
            <Link href="/admin/reports" className="text-blue-600 hover:text-blue-800">
              View Reports →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600 mb-4">Configure system settings</p>
            <Link href="/admin/settings" className="text-blue-600 hover:text-blue-800">
              View Settings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
