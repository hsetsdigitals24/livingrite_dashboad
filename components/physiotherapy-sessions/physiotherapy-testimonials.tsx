"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Mrs. Eze",
    role: "Physiotherapy Patient",
    content: "The physiotherapy sessions in my home are convenient and effective. The therapist is professional and makes me feel comfortable.",
    rating: 5,
  },
  {
    name: "Mr. Adebayo",
    role: "Mobility Restoration Patient",
    content: "I've regained my mobility and independence thanks to the personalized physiotherapy program. Highly satisfied!",
    rating: 5,
  },
  {
    name: "Ms. Chinyere",
    role: "Patient Family Member",
    content: "Seeing my mother progress with physiotherapy has been wonderful. The therapists are patient, skilled, and truly care.",
    rating: 5,
  },
]

export function PhysiotherapyTestimonials() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
            Patient Testimonials
          </h2>
          <p className="text-lg text-gray-700 animate-slide-up animation-delay-200">
            Hear from patients experiencing improved mobility and independence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full border-gray-300 bg-white hover:border-green-400 transition-all duration-300 hover:shadow-2xl hover:shadow-green-200">
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
