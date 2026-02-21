"use client"

import { useState, useEffect } from "react" 
import { Loader } from "lucide-react"
import { TestimonialCard } from "@/components/testimonials/testimonial-card"
import { VideoTestimonialCard } from "@/components/testimonials/video-testimonial-card"
import { CaseStudyCard } from "@/components/testimonials/case-study-card"
import { RatingAggregation } from "@/components/testimonials/rating-aggregation"
import { ServiceFilter } from "@/components/testimonials/service-filter"
import { CTABanner } from "@/components/cta-banner"

interface Testimonial {
  id: string
  clientName: string
  clientTitle?: string
  clientImage?: string
  rating: number
  content: string
  videoUrl?: string
  featured?: boolean
  service?: { id: string; title: string; slug: string }
}

interface CaseStudy {
  id: string
  slug: string
  title: string
  clientName: string
  challenge: string
  outcome: string
  heroImage?: string
  rating?: number
  featured?: boolean
  service?: { id: string; title: string }
}

interface Service {
  id: string
  title: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  })

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // Fetch services
        const servicesRes = await fetch("/api/services")
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json()
          setServices(servicesData.data || [])
        }

        // Fetch testimonials
        const testimonialsRes = await fetch("/api/testimonials")
        if (testimonialsRes.ok) {
          const testimonialsData = await testimonialsRes.json()
          setTestimonials(testimonialsData.data || [])
          setStats(testimonialsData.stats)
        }

        // Fetch case studies
        const caseStudiesRes = await fetch("/api/case-studies")
        if (caseStudiesRes.ok) {
          const caseStudiesData = await caseStudiesRes.json()
          setCaseStudies(caseStudiesData.data || [])
        }
      } catch (error) {
        console.error("Error loading testimonials data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter testimonials and case studies by selected service
  const filteredTestimonials = selectedService
    ? testimonials.filter((t) => t.service?.id === selectedService)
    : testimonials

  const filteredCaseStudies = selectedService
    ? caseStudies.filter((c) => c.service?.id === selectedService)
    : caseStudies

  // Separate video testimonials from text testimonials
  const videoTestimonials = filteredTestimonials.filter((t) => t.videoUrl)
  const textTestimonials = filteredTestimonials.filter((t) => !t.videoUrl)

  // Get featured case studies
  const featuredCaseStudies = filteredCaseStudies.filter((c) => c.featured).slice(0, 3)
  const otherCaseStudies = filteredCaseStudies.filter((c) => !c.featured)

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ✓ Trusted by 500+ Families
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Real Stories from Real Families
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how LivingRite Care has transformed lives and brought peace of mind to families across Nigeria and beyond.
            </p>
          </div>

          {/* Rating Widget */}
          {!loading && (
            <RatingAggregation
              averageRating={stats.averageRating}
              totalReviews={stats.totalReviews}
              ratingDistribution={stats.ratingDistribution}
            />
          )}
        </div>
      </section>

      {/* Video Testimonials Hero Section */}
      {!loading && videoTestimonials.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Video Testimonials</h2>
              <p className="text-gray-600">Hear directly from our clients about their experiences</p>
            </div>

            {/* Featured Video */}
            {videoTestimonials.length > 0 && (
              <div className="mb-12">
                <VideoTestimonialCard
                  title={videoTestimonials[0].clientName}
                  clientName={videoTestimonials[0].clientName}
                  clientTitle={videoTestimonials[0].clientTitle}
                  rating={videoTestimonials[0].rating}
                  videoUrl={videoTestimonials[0].videoUrl!}
                  isHero
                />
              </div>
            )}

            {/* Additional Videos Grid */}
            {videoTestimonials.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videoTestimonials.slice(1, 3).map((testimonial) => (
                  <VideoTestimonialCard
                    key={testimonial.id}
                    title={testimonial.clientName}
                    clientName={testimonial.clientName}
                    clientTitle={testimonial.clientTitle}
                    rating={testimonial.rating}
                    videoUrl={testimonial.videoUrl!}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Service Filter */}
      {!loading && services.length > 0 && (
        <section className="py-8 px-4 border-t border-gray-200">
          <div className="container mx-auto max-w-6xl">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Filter by Service</p>
            <ServiceFilter
              services={services.map((s) => ({ id: s.id, title: s.title }))}
              onFilterChange={setSelectedService}
              activeFilter={selectedService}
            />
          </div>
        </section>
      )}

      {/* Case Studies Section */}
      {!loading && (filteredCaseStudies.length > 0 || selectedService === null) && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Case Studies</h2>
              <p className="text-gray-600">Detailed success stories with measurable outcomes</p>
            </div>

            {filteredCaseStudies.length > 0 ? (
              <>
                {/* Featured Case Studies */}
                {featuredCaseStudies.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {featuredCaseStudies.map((caseStudy) => (
                      <CaseStudyCard key={caseStudy.id} {...caseStudy} />
                    ))}
                  </div>
                )}

                {/* Other Case Studies */}
                {otherCaseStudies.length > 0 && (
                  <div>
                    {featuredCaseStudies.length > 0 && (
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">More Success Stories</h3>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherCaseStudies.map((caseStudy) => (
                        <CaseStudyCard key={caseStudy.id} {...caseStudy} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No case studies available for this service yet.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Text Testimonials Section */}
      {!loading && textTestimonials.length > 0 && (
        <section className="py-16 px-4 bg-white border-t border-gray-200">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Client Reviews</h2>
              <p className="text-gray-600">Feedback from satisfied clients and family members</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {textTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} {...testimonial} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Data State */}
      {!loading && filteredTestimonials.length === 0 && filteredCaseStudies.length === 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <p className="text-gray-500 text-lg">No testimonials or case studies available for the selected filter.</p>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl flex justify-center">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <CTABanner />
    </main>
  )
}
