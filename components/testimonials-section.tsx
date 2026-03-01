"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
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
                imageUrl: "/african-woman-professional- headshot.png",
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
      <section className="py-16 bg-gradient-to-br from-[#ffffff] via-[#f5fbff] to-[#faf7ff]">
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
      <section className="py-16 bg-gradient-to-br from-[#ffffff] via-[#f5fbff] to-[#faf7ff]">
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
    <section id="testimonials" className="py-20 lg:py-28 bg-gradient-to-br from-[#ffffff] via-[#f5fbff] to-[#faf7ff] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00b2ec]/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-gradient-to-tr from-[#e50d92]/15 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00b2ec]/15 to-[#e50d92]/10 border border-[#00b2ec]/40 text-[#0088b8] px-4 py-3 rounded-full text-sm font-semibold mb-6 group hover:border-[#00b2ec]/60 hover:shadow-lg hover:shadow-[#00b2ec]/20 transition-all duration-300">
            <span className="w-2 h-2 bg-[#00b2ec] rounded-full animate-pulse"></span>
            Client Stories
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Loved by Families <br />
            <span className="bg-gradient-to-r from-[#00b2ec] via-[#0088b8] to-[#e50d92] bg-clip-text text-transparent animate-gradient-shift">
              Across Nigeria
            </span>
          </h2>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Real stories from families who experienced professional, compassionate home healthcare.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-[#00b2ec]/30 shadow-2xl shadow-[#00b2ec]/15 rounded-3xl overflow-hidden animate-slide-up animation-delay-300 hover:shadow-3xl hover:shadow-[#00b2ec]/25 transition-all duration-500">
            <CardContent className="p-10 md:p-14">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Testimonial Content */}
                <div className="md:flex-1">
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-[#e50d92] opacity-40 mb-6" />
                  
                  {/* Testimonial Text */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-8 italic font-light">
                    "{current.testimonial}"
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#00b2ec] fill-[#00b2ec]" />
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <img
                      src={current.imageUrl || "/placeholder.svg"}
                      alt={current.displayName}
                      className="w-16 h-16 rounded-full object-cover border-3 border-[#00b2ec]/40 shadow-lg"
                    />
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{current.displayName}</div>
                      <div className="text-sm text-gray-600 font-light">{current.displayRole}</div>
                      <div className="text-xs text-[#0088b8] font-medium mt-1">{current.location}</div>
                    </div>
                  </div>
                </div>

                {/* Navigation Section */}
                <div className="md:w-48 flex flex-col items-center gap-6">
                  {/* Navigation Buttons */}
                  <div className="w-full flex gap-3">
                    <button
                      onClick={() => setActiveIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1))}
                      className="flex-1 p-3 rounded-full border-2 border-[#00b2ec]/30 text-[#00b2ec] hover:bg-[#00b2ec]/10 hover:border-[#00b2ec]/60 transition-all duration-300"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-5 h-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => setActiveIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1))}
                      className="flex-1 p-3 rounded-full bg-gradient-to-r from-[#00b2ec] to-[#0088b8] text-white hover:shadow-lg hover:shadow-[#00b2ec]/50 transition-all duration-300"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-5 h-5 mx-auto" />
                    </button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#00b2ec] mb-2">
                      {activeIndex + 1}/{testimonials.length}
                    </div>
                    <p className="text-xs text-gray-500">Scroll through testimonials</p>
                  </div>

                  {/* Thumbnail Navigation */}
                  <div className="w-full grid grid-cols-3 gap-2 mt-4">
                    {testimonials.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          idx === activeIndex
                            ? "ring-2 ring-offset-2 ring-[#00b2ec] border-[#00b2ec]"
                            : "border-gray-200 hover:border-[#00b2ec]/50"
                        }`}
                        aria-label={`Show testimonial from ${t.displayName}`}
                      >
                        <img
                          src={t.imageUrl}
                          alt={t.displayName}
                          className="w-full h-full object-cover"
                        />
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
