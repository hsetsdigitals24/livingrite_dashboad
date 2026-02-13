"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Testimonial } from "@/lib/testimonials"
import { getTestimonials, getTestimonialImage } from "@/lib/testimonials"

interface TestimonialDisplay extends Testimonial {
  displayName: string
  displayRole: string
  imageUrl: string
  rating: number
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    async function loadTestimonials() {
      setIsLoading(true)
      try {
        const sanityTestimonials = await getTestimonials()
        
        // Transform Sanity testimonials to display format with fallback testimonials
        const displayTestimonials: TestimonialDisplay[] = sanityTestimonials.length > 0
          ? sanityTestimonials.map((t) => ({
              ...t,
              displayName: t.fullName,
              displayRole: t.patientRelation,
              imageUrl: getTestimonialImage(t),
              rating: 5,
            }))
          : [
              {
                _id: "1",
                fullName: "Chioma Okafor",
                patientRelation: "Daughter of Post-Stroke Patient",
                location: "Lagos, Nigeria",
                image: { asset: { _id: "" } },
                testimonial: "LivingRite Care transformed my mother's recovery journey. The nurses are skilled and genuinely caring. Daily updates gave our family peace of mind.",
                displayName: "Chioma Okafor",
                displayRole: "Daughter of Post-Stroke Patient",
                imageUrl: "/african-woman-professional-headshot.png",
                rating: 5,
              },
              {
                _id: "2",
                fullName: "Emeka Nwosu",
                patientRelation: "Son arranging care from UK",
                location: "London, United Kingdom",
                image: { asset: { _id: "" } },
                testimonial: "Finding trustworthy care from abroad was hard — LivingRite made it seamless with clear communication and thoughtful updates.",
                displayName: "Emeka Nwosu",
                displayRole: "Son arranging care from UK",
                imageUrl: "/african-man-professional-headshot.png",
                rating: 5,
              },
              {
                _id: "3",
                fullName: "Dr. Adebayo Johnson",
                patientRelation: "Medical Consultant",
                location: "Abuja, Nigeria",
                image: { asset: { _id: "" } },
                testimonial: "I refer patients to LivingRite for post-ICU support. Their team follows protocols and delivers reliable, high-quality home care.",
                displayName: "Dr. Adebayo Johnson",
                displayRole: "Medical Consultant",
                imageUrl: "/african-doctor-professional-headshot.jpg",
                rating: 5,
              },
            ]
        
        setTestimonials(displayTestimonials)
      } catch (error) {
        console.error("Error loading testimonials:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTestimonials()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-gray-600">No testimonials available</p>
          </div>
        </div>
      </section>
    )
  }
  const current = testimonials[activeIndex]

  return (
    <section id="testimonials" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
            Client Stories
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trusted by Families Across Nigeria</h2>
          <p className="text-sm text-gray-600 mt-2">Real stories from families who chose LivingRite Care</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={current.imageUrl || "/placeholder.svg"}
                      alt={current.displayName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{current.displayName}</div>
                      <div className="text-sm text-gray-500">{current.displayRole} • {current.location}</div>
                    </div>
                  </div>

                  <p className="text-gray-800 italic text-base">"{current.testimonial}"</p>

                  <div className="flex items-center gap-1 mt-4">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary" />
                    ))}
                  </div>
                </div>

                <div className="md:w-48 flex flex-col items-center gap-3">
                  <div className="w-full">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setActiveIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1))}
                        className="flex-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => setActiveIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1))}
                        className="flex-1"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-3 gap-2 mt-2">
                    {testimonials.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-14 rounded-md overflow-hidden border ${
                          idx === activeIndex ? "ring-2 ring-primary" : "border-gray-200"
                        }`}
                        aria-label={`Show testimonial ${idx + 1}`}
                      >
                        <img src={t.imageUrl} alt={t.fullName} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
