import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PhotoGalleryCarousel } from '@/components/testimonials/PhotoGalleryCarousel'

interface CaseStudyDetail {
  id: string
  slug: string
  title: string
  clientName: string
  clientTitle?: string
  heroImage?: string
  timeline: string
  serviceType: string
  challenge: string
  solution: string
  outcome: string
  fullStory: string
  metrics?: {
    label: string
    value: string
  }[]
  gallery?: {
    url: string
    caption?: string
  }[]
  testimonialQuote?: string
}

interface CaseStudyParams {
  slug: string
}

export async function generateMetadata(
  { params }: { params: CaseStudyParams }
): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/case-studies/${params.slug}`, {
      cache: 'revalidate',
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return { title: 'Case Study Not Found' }
    }

    const caseStudy = await res.json()

    return {
      title: `${caseStudy.title} | Case Study`,
      description: caseStudy.challenge,
      openGraph: {
        title: caseStudy.title,
        description: caseStudy.challenge,
        images: caseStudy.heroImage ? [{ url: caseStudy.heroImage }] : [],
      },
    }
  } catch {
    return { title: 'Case Study' }
  }
}

async function getCaseStudy(slug: string): Promise<CaseStudyDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/case-studies/${slug}`, {
      cache: 'revalidate',
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return null
    }

    return res.json()
  } catch (error) {
    console.error('Failed to fetch case study:', error)
    return null
  }
}

async function getRelatedCaseStudies(
  serviceType: string,
  currentSlug: string,
  limit: number = 3
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(
      `${baseUrl}/api/case-studies?service=${serviceType}&limit=${limit}`,
      {
        cache: 'revalidate',
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) return []

    const data = await res.json()
    return data.caseStudies?.filter((cs: any) => cs.slug !== currentSlug) || []
  } catch {
    return []
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: CaseStudyParams
}) {
  const caseStudy = await getCaseStudy(params.slug)

  if (!caseStudy) {
    notFound()
  }

  const relatedStudies = await getRelatedCaseStudies(
    caseStudy.serviceType,
    params.slug
  )

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        {caseStudy.heroImage ? (
          <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
            <Image
              src={caseStudy.heroImage}
              alt={caseStudy.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        ) : (
          <div className="h-96 w-full bg-gradient-to-br from-blue-500 to-indigo-600"></div>
        )}

        {/* Content Overlay */}
        <div className="relative -mt-32 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-lg bg-white p-8 shadow-xl">
              <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                {caseStudy.serviceType}
              </div>
              <h1 className="mb-4 text-4xl font-bold text-gray-900">
                {caseStudy.title}
              </h1>
              <p className="mb-4 text-lg text-gray-600">{caseStudy.challenge}</p>
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-semibold text-gray-900">
                    {caseStudy.clientName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timeline</p>
                  <p className="font-semibold text-gray-900">
                    {caseStudy.timeline}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Key Metrics */}
          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="mb-12 grid gap-4 sm:grid-cols-3">
              {caseStudy.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center border border-blue-100"
                >
                  <p className="mb-2 text-3xl font-bold text-blue-600">
                    {metric.value}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Story Content */}
          <div className="prose prose-sm max-w-none mb-12">
            {/* Challenge Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                The Challenge
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </div>

            {/* Solution Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Approach
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {caseStudy.solution}
              </p>
            </div>

            {/* Full Story */}
            {caseStudy.fullStory && (
              <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  The Complete Story
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {caseStudy.fullStory}
                </div>
              </div>
            )}

            {/* Outcome Section */}
            <div className="mb-12 p-6 bg-green-50 rounded-lg border border-green-200">
              <h2 className="text-2xl font-bold text-green-900 mb-4">
                ✓ The Outcome
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {caseStudy.outcome}
              </p>
            </div>

            {/* Testimonial Quote */}
            {caseStudy.testimonialQuote && (
              <div className="my-12 border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-lg">
                <p className="mb-4 italic text-gray-700">
                  "{caseStudy.testimonialQuote}"
                </p>
                <p className="font-semibold text-gray-900">
                  — {caseStudy.clientName}
                </p>
              </div>
            )}
          </div>

          {/* Gallery */}
          {caseStudy.gallery && caseStudy.gallery.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Photo Gallery
              </h2>
             <PhotoGalleryCarousel 
  images={[
    { url: "...", caption: "John's first day", alt: "Patient photo" },
    { url: "...", caption: "Progress check" }
  ]}
  title="Care Journey"
/>
            </div>
          )}
        </div>
      </section>

      {/* Related Case Studies */}
      {relatedStudies.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Related Case Studies
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedStudies.slice(0, 3).map((study: any) => (
                <a
                  key={study.id}
                  href={`/testimonials/${study.slug}`}
                  className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-300"
                >
                  {study.heroImage && (
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                      <img
                        src={study.heroImage}
                        alt={study.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600">
                    {study.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {study.clientName} • {study.timeline}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Inspired by this story?
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            Let us help you or your loved one on their care journey
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/client/booking"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Schedule Consultation
            </a>
            <a
              href="/contact"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
