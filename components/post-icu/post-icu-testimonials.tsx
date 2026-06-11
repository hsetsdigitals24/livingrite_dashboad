"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Mr. & Mrs. Oluwale",
    role: "Family",
    content: "After ICU discharge, their post-ICU care gave us confidence to bring our father home. The monitoring and support were exceptional.",
    rating: 5,
  },
  {
    name: "Dr. Adeyinka",
    role: "Referring Physician",
    content: "I trust their post-ICU care services completely. They provide the same level of attention patients need after ICU discharge.",
    rating: 5,
  },
  {
    name: "Ms. Ifunanya",
    role: "Patient Family",
    content: "The transition from ICU to home was smooth thanks to their expert team. My mother recovered excellently with their support.",
    rating: 5,
  },
]

export function PostICUTestimonials() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
            Patient Recovery Stories
          </h2>
          <p className="text-lg text-gray-700 animate-slide-up animation-delay-200">
            Families grateful for smooth ICU to home transitions and excellent care.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full border-gray-300 bg-white hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">{`"${testimonial.content}"`}</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
