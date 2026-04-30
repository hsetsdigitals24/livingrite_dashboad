"use client";

import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import CaregiverBookingModal from '@/components/caregiver/CaregiverBookingModal'
import DoctorAppointmentModal from '@/components/caregiver/DoctorAppointmentModal'

const Schedule = () => {
  const [bookings, setBookings] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAppointments, setLoadingAppointments] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDoctorModal, setShowDoctorModal] = useState(false)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/caregiver/bookings')
      const json = await res.json()
      if (json.success) setBookings(json.data)
    } catch (err) {
      console.error('failed', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAppointments = async () => {
    setLoadingAppointments(true)
    try {
      const res = await fetch('/api/caregiver/doctor-appointments')
      const json = await res.json()
      if (json.success) setAppointments(json.data)
    } catch (err) {
      console.error('failed to load appointments', err)
    } finally {
      setLoadingAppointments(false)
    }
  }

  useEffect(() => {
    fetchBookings()
    fetchAppointments()
  }, [])


  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-800">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-gray-700 mb-4 animate-fade-in-up">
            My Schedule
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Keep track of your upcoming consultations and appointments.
          </p>
        </div>
      </section>

      {/* Schedule Overview Card */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Upcoming Appointments</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </button>
              <button
                onClick={() => setShowDoctorModal(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Add Doctor Visit
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="group relative bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all animate-fade-in-up">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur opacity-0 transition-all duration-300" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-gray-600">No appointments scheduled. Use the button above to add one.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-lg shadow p-4 flex justify-between items-center animate-fade-in-up"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {b.patient?.firstName} {b.patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(b.scheduledAt).toLocaleString()}
                      {b.service && ` – ${b.service.title}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 capitalize">{b.status.toLowerCase()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Doctor visits section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Upcoming Doctor Visits</h2>
          </div>

          {loadingAppointments ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="group relative bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all animate-fade-in-up">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur opacity-0 transition-all duration-300" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-gray-600">No doctor appointments scheduled.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-lg shadow p-4 flex justify-between items-center animate-fade-in-up"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {a.patient?.firstName} {a.patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(a.date).toLocaleString()} – {a.provider}
                    </p>
                    <p className="text-sm text-gray-500">{a.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CaregiverBookingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchBookings}
      />
      <DoctorAppointmentModal
        isOpen={showDoctorModal}
        onClose={() => setShowDoctorModal(false)}
        onSuccess={fetchAppointments}
      />
    </main>
  )
}

export default Schedule;