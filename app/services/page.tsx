import { ServicesHero } from "@/components/services/services-hero"
import { ServicesGrid } from "@/components/services/services-grid"
import { CTABanner } from "@/components/cta-banner"

export const metadata = {
  title: "Our Services - Living Rite Care",
  description: "Explore our comprehensive healthcare services including post-stroke care, post-ICU care, physiotherapy, and more.",
  openGraph: {
    title: "Our Services - Living Rite Care",
    description: "Professional home healthcare services tailored to your needs",
    url: "https://livingritecare.com/services",
  },
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen"> 
      <ServicesHero />
      <ServicesGrid />
      <CTABanner /> 
    </main>
  )
}
