'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Users, Calendar, MessageCircle, ArrowRight } from 'lucide-react'

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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-800">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-gray-700 mb-4 animate-fade-in-up">
            Caregiver Dashboard
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Access your patients, schedule, and messages all in one place.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/caregiver" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'My Patients',
              desc: 'View and manage your assigned patients',
              href: '/caregiver/patients',
              icon: Users,
              color: 'from-blue-500 to-blue-600',
            },
            {
              title: 'Schedule',
              desc: 'View your consultations and appointments',
              href: '/caregiver/schedule',
              icon: Calendar,
              color: 'from-green-500 to-green-600',
            },
            {
              title: 'My Messages',
              desc: 'View and manage your messages with clients',
              href: '/caregiver/messages',
              icon: MessageCircle,
              color: 'from-purple-500 to-purple-600',
            },
          ].map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                className="group relative bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h2>
                <p className="text-gray-600 mb-4">{card.desc}</p>
                <Link
                  href={card.href}
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                >
                  {`View ${card.title.split(' ')[1]}`} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
