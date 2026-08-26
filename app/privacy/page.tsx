import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | LivingRite Care',
  description:
    'How LivingRite Care collects, uses, protects, and shares your personal and health information.',
}

const LAST_UPDATED = 'August 26, 2026'

export default function PrivacyPolicyPage() {
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
            Your Privacy Matters
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Privacy Policy
          </h1>
          <p className="text-blue-100 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed space-y-8">
            <p>
              LivingRite Care (&quot;LivingRite,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) is committed to protecting the privacy of our patients, their
              families, caregivers, and everyone who uses our platform. This Privacy Policy explains
              what information we collect, how we use it, and the choices you have. By using our
              website and services, you agree to the practices described here.
            </p>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                1. Information We Collect
              </h2>
              <p className="mb-3">We collect the following categories of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account information</strong> — name, email address, phone number,
                  password, and the role you hold on the platform (client, caregiver, or admin).
                </li>
                <li>
                  <strong>Health &amp; care information</strong> — patient details, medical needs,
                  care notes, appointment history, and other information needed to deliver home
                  healthcare services.
                </li>
                <li>
                  <strong>Booking &amp; payment information</strong> — services requested, schedules,
                  invoices, and payment records processed through our payment provider.
                </li>
                <li>
                  <strong>Communications</strong> — messages, support tickets, and correspondence
                  exchanged through the platform.
                </li>
                <li>
                  <strong>Technical information</strong> — device, browser, IP address, and usage
                  data collected automatically to keep the service secure and running.
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                2. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide, coordinate, and improve home healthcare services.</li>
                <li>To match patients with appropriate caregivers and manage assignments.</li>
                <li>To process bookings, invoices, and payments.</li>
                <li>To communicate with you about appointments, updates, and support requests.</li>
                <li>To keep our platform safe, secure, and compliant with applicable law.</li>
              </ul>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                3. How We Share Information
              </h2>
              <p className="mb-3">
                We do not sell your personal or health information. We share it only as needed to
                deliver our services, including with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Assigned caregivers and care staff, limited to the patient information required for
                  their care.
                </li>
                <li>
                  Family members you have authorized to access a patient&apos;s records.
                </li>
                <li>
                  Trusted service providers who support our operations (for example, email, SMS,
                  secure file storage, and payment processing).
                </li>
                <li>
                  Authorities or third parties where required by law or to protect the safety of our
                  patients and staff.
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                4. Data Security
              </h2>
              <p>
                We use industry-standard safeguards — including access controls, encryption in
                transit, and role-based permissions — to protect your information. Access to patient
                data is strictly limited to authorized users with a legitimate care relationship. No
                system is perfectly secure, but we work continuously to protect your data.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                5. Data Retention
              </h2>
              <p>
                We retain your information for as long as your account is active or as needed to
                provide services, comply with our legal obligations, resolve disputes, and enforce
                our agreements. When information is no longer required, we securely delete or
                anonymize it.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                6. Your Rights &amp; Choices
              </h2>
              <p>
                You may request access to, correction of, or deletion of your personal information,
                subject to applicable law and our legitimate need to retain certain records. You can
                also update most account details directly within the platform. To make a request,
                contact us using the details below.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                7. Children&apos;s Privacy
              </h2>
              <p>
                Our platform is intended for use by adults. Where we handle information about a minor
                receiving care, it is provided and managed by an authorized parent, guardian, or
                family member.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                8. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will revise the
                &quot;Last updated&quot; date above. Continued use of our services after changes take
                effect constitutes acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                9. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy or how we handle your information,
                please{' '}
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
