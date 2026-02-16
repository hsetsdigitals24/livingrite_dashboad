"use client"

import { useEffect, useState } from "react"
import { ServiceProcess } from "@/components/services/service-process"
import { ServiceFAQ } from "@/components/services/service-faq"
import { CTABanner } from "@/components/cta-banner"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface ServiceConfig {
  slug: string
  title: string
  description: string
  components: React.ReactNode[]
  processType: string
  faqType: string
}

interface ServiceDetailContentProps {
  service: ServiceConfig
}

export function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(false)
    const timer = setTimeout(() => {
      setFadeIn(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [service.slug])

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <div className={`fixed top-24 left-6 z-40 transition-opacity duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to All Services
        </Link>
      </div>

      {/* Content with fade-in animation */}
      <div className={`transition-all duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
        {/* Render service-specific components */}
        {service.components.map((component, idx) => (
          <div
            key={idx}
            className={`transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            {component}
          </div>
        ))}

        {/* Common sections for all services */}
        <div
          className={`transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: `${service.components.length * 100}ms` }}
        >
          <ServiceProcess serviceType={service.processType} />
        </div>

        <div
          className={`transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: `${(service.components.length + 1) * 100}ms` }}
        >
          <ServiceFAQ serviceType={service.faqType} />
        </div>

        <div
          className={`transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: `${(service.components.length + 2) * 100}ms` }}
        >
          <CTABanner />
        </div>
      </div>
    </main>
  )
}
