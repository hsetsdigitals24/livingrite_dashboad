"use client"

import { useState, useEffect } from "react" 
import { Loader, Star, Play, ArrowRight, CheckCircle2, Users } from "lucide-react" 
import { CTABanner } from "@/components/cta-banner"
import Link from "next/link"

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

export const dynamic = 'force-dynamic';

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-[#00b2ec] text-[#00b2ec]" : "text-gray-300"}`}
      />
    ))
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#00b2ec] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#ffffff] via-[#f5fbff] to-[#faf7ff] overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00b2ec]/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-60"></div>
          <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-gradient-to-tr from-[#e50d92]/15 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00b2ec]/15 to-[#e50d92]/10 border border-[#00b2ec]/40 text-[#0088b8] px-4 py-3 rounded-full text-sm font-semibold mb-6 group hover:border-[#00b2ec]/60 hover:shadow-lg hover:shadow-[#00b2ec]/20 transition-all duration-300">
              <span className="w-2 h-2 bg-[#00b2ec] rounded-full animate-pulse"></span>
              Trusted by Families & Healthcare Providers
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Real Stories from <br />
              <span className="bg-gradient-to-r from-[#00b2ec] via-[#0088b8] to-[#e50d92] bg-clip-text text-transparent">
                Satisfied Families
              </span>
            </h1>
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              Discover how LivingRite has transformed the care experience for families across Nigeria. Read authentic testimonials and success stories from our clients.
            </p>
          </div>

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#00b2ec]/20 shadow-lg hover:shadow-xl hover:border-[#00b2ec]/40 transition-all duration-300">
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-3">
                  {renderStars(5)}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#00b2ec] to-[#0088b8] bg-clip-text text-transparent mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#e50d92]/20 shadow-lg hover:shadow-xl hover:border-[#e50d92]/40 transition-all duration-300">
              <div className="text-center">
                <Users className="w-10 h-10 text-[#e50d92] mx-auto mb-3" />
                <div className="text-3xl font-bold text-[#e50d92] mb-2">{stats.totalReviews}+</div>
                <p className="text-sm text-gray-600">Happy Families</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#0088b8]/20 shadow-lg hover:shadow-xl hover:border-[#0088b8]/40 transition-all duration-300">
              <div className="text-center">
                <CheckCircle2 className="w-10 h-10 text-[#0088b8] mx-auto mb-3" />
                <div className="text-3xl font-bold text-[#0088b8] mb-2">{caseStudies.length}+</div>
                <p className="text-sm text-gray-600">Success Stories</p>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* Service Filter */}
      {services.length > 0 && (
        <section className="py-8 border-b border-gray-200 sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedService(null)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedService === null
                    ? "bg-gradient-to-r from-[#00b2ec] to-[#0088b8] text-white shadow-lg shadow-[#00b2ec]/50"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Services
              </button>
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedService === service.id
                      ? "bg-gradient-to-r from-[#00b2ec] to-[#0088b8] text-white shadow-lg shadow-[#00b2ec]/50"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {service.title}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Testimonials */}
      {videoTestimonials.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Video Testimonials
              </h2>
              <p className="text-gray-600">Hear directly from our clients about their experience with LivingRite</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#00b2ec]/10 hover:border-[#00b2ec]/30"
                >
                  {/* Video Thumbnail */}
                  <div className="relative h-64 bg-gray-900 overflow-hidden">
                    {testimonial.clientImage && (
                      <img
                        src={testimonial.clientImage}
                        alt={testimonial.clientName}
                        className="w-full h-full object-cover opacity-40"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="w-16 h-16 bg-[#e50d92] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex gap-1 mb-3">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-gray-700 line-clamp-3 mb-4 italic">{testimonial.content}</p>
                    <div className="flex items-center gap-3">
                      {testimonial.clientImage && (
                        <img
                          src={testimonial.clientImage}
                          alt={testimonial.clientName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.clientName}</p>
                        <p className="text-sm text-gray-600">{testimonial.clientTitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Text Testimonials */}
      {textTestimonials.length > 0 && (
        <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Client Testimonials
              </h2>
              <p className="text-gray-600">Stories of care, trust, and positive outcomes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {textTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-[#00b2ec]/10 hover:border-[#00b2ec]/30 transition-all duration-300 flex flex-col"
                >
                  <div className="flex gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 flex-grow italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    {testimonial.clientImage && (
                      <img
                        src={testimonial.clientImage}
                        alt={testimonial.clientName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#00b2ec]/30"
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.clientName}</p>
                      <p className="text-sm text-gray-600">{testimonial.clientTitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Case Studies */}
      {featuredCaseStudies.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Featured Success Stories
              </h2>
              <p className="text-gray-600">In-depth case studies showcasing transformative care outcomes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCaseStudies.map((caseStudy) => (
                <Link
                  key={caseStudy.id}
                  href={`/case-studies/${caseStudy.slug}`}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#00b2ec]/10 hover:border-[#00b2ec]/30 flex flex-col h-full"
                >
                  {/* Image */}
                  {caseStudy.heroImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={caseStudy.heroImage}
                        alt={caseStudy.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00b2ec] transition-colors">
                      {caseStudy.title}
                    </h3>

                    {caseStudy.rating && (
                      <div className="flex gap-1 mb-3">
                        {renderStars(caseStudy.rating)}
                      </div>
                    )}

                    <p className="text-gray-600 line-clamp-2 mb-4 flex-grow">{caseStudy.challenge}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{caseStudy.clientName}</p>
                        <p className="text-xs text-gray-600">{caseStudy.service?.title}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#00b2ec] group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Case Studies */}
      {otherCaseStudies.length > 0 && (
        <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                More Success Stories
              </h2>
              <p className="text-gray-600">Explore additional case studies and patient outcomes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCaseStudies.map((caseStudy) => (
                <Link
                  key={caseStudy.id}
                  href={`testimonials/case-studies/${caseStudy.slug}`}
                  className="group bg-white rounded-xl p-6 shadow hover:shadow-lg border border-gray-200 hover:border-[#00b2ec]/30 transition-all duration-300"
                >
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#00b2ec] transition-colors line-clamp-2">
                    {caseStudy.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{caseStudy.challenge}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#0088b8]">{caseStudy.clientName}</span>
                    <ArrowRight className="w-4 h-4 text-[#00b2ec] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rating Distribution */}
      {stats.totalReviews > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#00b2ec]/10 to-[#e50d92]/10 rounded-3xl p-12 border border-[#00b2ec]/20">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Rating Distribution</h2>

              <div className="space-y-6">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] || 0
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="w-20 flex items-center justify-end">
                        <span className="inline-flex gap-1">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#00b2ec] text-[#00b2ec]" />
                          ))}
                        </span>
                      </div>
                      <div className="flex-grow bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#00b2ec] to-[#0088b8] h-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-16 text-right">
                        <span className="font-semibold text-gray-900">{count}</span>
                        <span className="text-gray-600 text-sm"> ({percentage.toFixed(0)}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {testimonials.length === 0 && caseStudies.length === 0 && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <p className="text-gray-600 text-lg">No testimonials available yet. Check back soon!</p>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <CTABanner />
    </main>
  )
}
