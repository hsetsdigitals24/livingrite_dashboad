import { HeroSection } from "@/components/hero-section"
import { TrustIndicators } from "@/components/trust-indicators"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTABanner } from "@/components/cta-banner"
import PopupDisplay from "@/components/PopupDisplay"

export default function HomePage() {
  return (
    <main className="min-h-screen"> 
      <HeroSection />
      <TrustIndicators />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <CTABanner />
      <PopupDisplay />
    </main>
  )
}
