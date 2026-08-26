import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | LivingRite Care',
  description:
    'The terms and conditions governing your use of the LivingRite Care platform and services.',
}

const LAST_UPDATED = 'August 26, 2026'

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative py-20 overflow-hidden"
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
            Terms &amp; Conditions
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Terms of Service
          </h1>
          <p className="text-blue-100 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed space-y-8">
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
              LivingRite Care platform, website, and services (collectively, the
              &quot;Services&quot;). By creating an account or using the Services, you agree to be
              bound by these Terms. If you do not agree, please do not use the Services.
            </p>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                1. Who We Are
              </h2>
              <p>
                LivingRite Care provides a smart booking and care-management platform that connects
                patients and their families with home healthcare services and caregivers. We
                facilitate the coordination, scheduling, and management of care.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                2. Eligibility &amp; Accounts
              </h2>
              <p>
                You must be at least 18 years old to create an account. You agree to provide accurate
                information, keep your credentials confidential, and are responsible for all activity
                that occurs under your account. Notify us promptly of any unauthorized use.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                3. Use of the Services
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Services only for lawful purposes and in accordance with these Terms.</li>
                <li>
                  Do not misuse, disrupt, or attempt to gain unauthorized access to the platform or
                  other users&apos; data.
                </li>
                <li>
                  Only access patient information for which you have a legitimate, authorized care
                  relationship.
                </li>
                <li>Provide accurate care, health, and booking information.</li>
              </ul>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                4. Bookings, Payments &amp; Cancellations
              </h2>
              <p>
                Fees for services are presented before you confirm a booking. Payments are processed
                through our third-party payment provider. Unless otherwise stated, invoices are due
                as indicated at the time of booking. Cancellation and rescheduling terms will be made
                available for the relevant service; certain fees may be non-refundable.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                5. Medical Disclaimer
              </h2>
              <p>
                The Services support the coordination and delivery of home healthcare but are not a
                substitute for emergency medical care. In a medical emergency, call your local
                emergency services immediately. Care is provided by qualified professionals, but you
                are responsible for the decisions you make regarding your or your loved one&apos;s
                care.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                6. Caregivers
              </h2>
              <p>
                Caregivers using the platform agree to deliver services professionally, honor their
                assignments, maintain patient confidentiality, and comply with all applicable
                healthcare standards and regulations.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                7. Intellectual Property
              </h2>
              <p>
                The platform, including its content, logos, and software, is owned by LivingRite Care
                and protected by intellectual property laws. You may not copy, modify, distribute, or
                create derivative works without our written permission.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                8. Privacy
              </h2>
              <p>
                Your use of the Services is also governed by our{' '}
                <a href="/privacy" className="text-primary font-semibold hover:underline">
                  Privacy Policy
                </a>
                , which explains how we collect, use, and protect your information.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                9. Termination
              </h2>
              <p>
                We may suspend or terminate your access to the Services if you violate these Terms or
                use the Services in a way that could harm other users, our staff, or LivingRite Care.
                You may stop using the Services at any time.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                10. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by law, LivingRite Care shall not be liable for any
                indirect, incidental, or consequential damages arising from your use of the Services.
                The Services are provided &quot;as is&quot; without warranties of any kind, except as
                required by law.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                11. Changes to These Terms
              </h2>
              <p>
                We may update these Terms from time to time. When we do, we will revise the
                &quot;Last updated&quot; date above. Continued use of the Services after changes take
                effect constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                12. Contact Us
              </h2>
              <p>
                If you have questions about these Terms, please{' '}
                <a href="/contact" className="text-primary font-semibold hover:underline">
                  contact us
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
