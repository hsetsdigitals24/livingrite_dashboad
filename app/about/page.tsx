import type { Metadata } from 'next'
import { TestimonialWidgetServer } from '@/components/TestimonialWidgetServer'

export const metadata: Metadata = {
  title: 'About Us | LivingRite Care',
  description:
    'Learn about LivingRite Care — our mission, our team, and why families across Nigeria trust us for expert home healthcare.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative py-24 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #00b2ec 0%, #0077a8 60%, #005f88 100%)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, white 0%, transparent 50%), radial-gradient(circle at 10% 80%, #e50d92 0%, transparent 40%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            Who We Are
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Compassionate Care,
            <br />
            Delivered at Home
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            LivingRite Care is Nigeria&apos;s trusted home healthcare provider, bringing
            hospital-quality nursing and rehabilitation services directly to your family.
          </p>
        </div>
      </section>

      {/* ── Mission & Values ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe every patient deserves dignified, expert care in the comfort of their
                own home. Our hospital-trained nurses and physiotherapists work tirelessly to
                support recovery, independence, and quality of life — for patients and their
                families alike.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From post-stroke recovery to ICU step-down care, physiotherapy, palliative
                support, and beyond, LivingRite Care is with you every step of the way.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🏥', label: 'Hospital-Trained Staff' },
                { icon: '🤝', label: 'Family-Centered Care' },
                { icon: '📍', label: 'Serving All of Lagos' },
                { icon: '⏰', label: '24 / 7 Support' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl p-5 text-center"
                  style={{ background: '#f0fbff', border: '1px solid rgba(0,178,236,0.15)' }}
                >
                  <p className="text-3xl mb-2">{item.icon}</p>
                  <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial Widget ────────────────────────────────────────── */}
      <TestimonialWidgetServer
        variant="about"
        title="Families Who Trust Us"
        subtitle="Stories from patients and caregivers who have experienced the LivingRite difference."
      />

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-2xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Ready to get started?
          </h2>
          <p className="text-gray-500 mb-8">
            Contact us today to discuss your loved one&apos;s care needs. Our team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #00b2ec, #0077a8)' }}
          >
            Get in Touch
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  )
}
