    import { Metadata } from 'next'
import { TestimonialCarousel } from '@/components/testimonials/TestimonialCarousel'
import { TestimonialGrid } from '@/components/testimonials/TestimonialGrid'
import { RatingAggregation } from '@/components/testimonials/RatingAggregation'
import { GoogleReviewsWidget } from '@/components/testimonials/GoogleReviewsWidget'
import { PhotoGalleryCarousel } from '@/components/testimonials/PhotoGalleryCarousel'

export const metadata: Metadata = {
  title: 'Testimonials & Case Studies | LivingRite',
  description: 'Read authentic testimonials from families and case studies showcasing our care expertise across stroke recovery, ICU care, palliative support, and family wellness.',
  openGraph: {
    title: 'Testimonials & Case Studies | LivingRite',
    description: 'Real stories from families we\'ve helped. See how LivingRite made a difference.',
    images: [{ url: '/og-testimonials.jpg' }],
  },
}

async function fetchTestimonials() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || ''
    const res = await fetch(`${baseUrl}/api/testimonials?featured=true&limit=6`, { 
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.testimonials || []
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    return []
  }
}

async function fetchCaseStudies() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || ""
    const res = await fetch(`${baseUrl}/api/case-studies?featured=true&limit=3`, { 
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.caseStudies || []
  } catch (error) {
    console.error('Failed to fetch case studies:', error)
    return []
  }
}

async function fetchServices() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || ''
    const res = await fetch(`${baseUrl}/api/services`, { 
      next: { revalidate: 86400 }, // Revalidate every day
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.services || []
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return []
  }
}

export default async function TestimonialsPage() {
  const [testimonials, caseStudies, services] = await Promise.all([
    fetchTestimonials(),
    fetchCaseStudies(),
    fetchServices(),
  ])

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Real Stories, Real Impact
          </h1>
          <p className="text-lg text-blue-100 sm:text-xl">
            Discover how LivingRite has made a meaningful difference in the lives of families across the country
          </p>
        </div>
      </section>

      {/* Rating & Reviews Section */}
      <section className="border-b border-gray-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RatingAggregation />
            </div>
            <div className="lg:col-span-1">
              <GoogleReviewsWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video Testimonials */}
      {testimonials.length > 0 && (
        <section className="border-b border-gray-200 bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                ✨ Voices of Care
              </h2>
              <p className="text-lg text-gray-600">
                Hear directly from the families we serve about their experience
              </p>
            </div>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* Featured Case Studies */}
      {caseStudies.length > 0 && (
        <section className="border-b border-gray-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                📖 Featured Case Studies
              </h2>
              <p className="text-lg text-gray-600">
                Detailed narratives of transformation and care excellence
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {caseStudies.slice(0, 3).map((study: any) => (
                <a
                  key={study.id}
                  href={`/testimonials/${study.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-300"
                >
                  <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                    {study.heroImage && (
                      <img
                        src={study.heroImage}
                        alt={study.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600">
                    {study.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">{study.clientName}</span>
                    {study.timeline && <span className="text-gray-500"> • {study.timeline}</span>}
                  </p>
                  <p className="line-clamp-3 text-gray-700 mb-4">
                    {study.challenge}
                  </p>
                  <div className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                    Read Full Story →
                  </div>
                </a>
              ))}
            </div>
            {caseStudies.length > 3 && (
              <div className="mt-8 text-center">
                <a
                  href="#all-case-studies"
                  className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  View All Case Studies
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      <section className="border-b border-gray-200 bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              📸 Care Moments
            </h2>
            <p className="text-lg text-gray-600">
              Visual snapshots of compassion, support, and recovery in action
            </p>
          </div>
          <PhotoGalleryCarousel />
        </div>
      </section>

      {/* Filterable Grid - All Testimonials & Case Studies */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8" id="all-case-studies">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              🎯 All Stories & Testimonials
            </h2>
            <p className="text-lg text-gray-600">
              Explore by service type to find stories relevant to your needs
            </p>
          </div>
          <TestimonialGrid
            testimonials={testimonials}
            caseStudies={caseStudies}
            services={services}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to Begin Your Care Journey?
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            Join hundreds of families who trust LivingRite for expert, compassionate care
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/client/booking"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Schedule a Consultation
            </a>
            <a
              href="/contact"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
