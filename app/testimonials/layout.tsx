import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Testimonials & Case Studies - Living Rite Care",
  description: "Read real success stories from families who trusted LivingRite Care with their loved ones. Video testimonials, detailed case studies, and client reviews.",
  openGraph: {
    title: "Testimonials & Case Studies - Living Rite Care",
    description: "Discover how LivingRite Care transformed lives and brought peace of mind to families",
    url: "https://livingritecare.com/testimonials",
  },
}

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children
}
