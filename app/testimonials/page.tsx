"use client"

import { useState, useEffect } from "react" 
import { Loader } from "lucide-react" 
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
       
    
      <CTABanner />
    </main>
  )
}
