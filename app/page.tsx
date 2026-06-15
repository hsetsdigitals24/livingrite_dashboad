import { HeroSection } from "@/components/hero-section"
// import { TrustIndicators } from "@/components/trust-indicators"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { CTABanner } from "@/components/cta-banner"
import { TrainingSection } from "@/components/training-section"
import PopupDisplay from "@/components/PopupDisplay"
import Youtube from "@/components/Youtube"
import { TestimonialWidgetServer } from "@/components/TestimonialWidgetServer"

// ISR: re-render so the Prisma-backed testimonial widget stays fresh. The admin
// testimonials API also revalidates this path on demand for instant updates.
export const revalidate = 60

export default function HomePage() {
  return (
    <main className="min-h-screen"> 
      <HeroSection />
      {/* <TrustIndicators /> */}
      <Youtube />
      <ServicesSection />
      <TrainingSection />
      <AboutSection />
      <TestimonialWidgetServer
        variant="homepage"
        title="What Our Clients Say"
        subtitle="Real stories from real families we've had the privilege to care for."
      />
      <CTABanner />
      <PopupDisplay />
    </main>
  )
}
