"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Zap, Users, Stethoscope, Home, Award, Shield } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Customized Programs",
    description: "Programs tailored to your specific condition and recovery goals.",
    color: "from-green-100 to-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Users,
    title: "Expert Therapists",
    description: "Certified physiotherapists with specialized training and experience.",
    color: "from-lime-100 to-lime-50",
    iconColor: "text-lime-600",
  },
  {
    icon: Stethoscope,
    title: "Professional Assessment",
    description: "Comprehensive evaluation to develop the most effective treatment plan.",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary/80",
  },
  {
    icon: Home,
    title: "In-Home Therapy",
    description: "Convenient therapy sessions in the comfort and familiarity of your home.",
    color: "from-green-100 to-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Award,
    title: "Progress Tracking",
    description: "Regular assessments and monitoring to ensure optimal recovery progress.",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary/80",
  },
  {
    icon: Shield,
    title: "Safe & Professional",
    description: "All therapists are properly credentialed and follow safety protocols.",
    color: "from-green-100 to-green-50",
    iconColor: "text-green-600",
  },
]

export function PhysiotherapyFeatures() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
            Professional Physiotherapy Services
          </h2>
          <p className="text-lg text-gray-700 animate-slide-up animation-delay-200">
            Expert physical therapy designed to restore your mobility and independence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <Card className="h-full border-gray-300 bg-white hover:border-green-400 transition-all duration-300 hover:shadow-2xl hover:shadow-green-200 hover:scale-105">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
