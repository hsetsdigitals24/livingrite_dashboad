"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Clock, Stethoscope, AlertCircle, Activity, Users } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "Continuous Monitoring",
    description: "24/7 vital sign monitoring and health status tracking with immediate response capability.",
    color: "from-blue-100 to-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Clock,
    title: "Round-the-Clock Care",
    description: "Professional nurses available at all times to respond to any medical needs or emergencies.",
    color: "from-cyan-100 to-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    icon: Stethoscope,
    title: "Medical Expertise",
    description: "Hospital-trained nurses with ICU experience managing complex post-acute medical needs.",
    color: "from-sky-100 to-sky-50",
    iconColor: "text-sky-600",
  },
  {
    icon: AlertCircle,
    title: "Emergency Response",
    description: "Quick intervention protocols and coordination with medical facilities if needed.",
    color: "from-blue-100 to-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Activity,
    title: "Recovery Support",
    description: "Rehabilitation exercises and mobility assistance to accelerate recovery and prevent complications.",
    color: "from-cyan-100 to-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    icon: Users,
    title: "Family Communication",
    description: "Regular updates and open communication with family members about patient progress.",
    color: "from-sky-100 to-sky-50",
    iconColor: "text-sky-600",
  },
]

export function PostICUFeatures() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
            Comprehensive Post-ICU Care
          </h2>
          <p className="text-lg text-gray-700 animate-slide-up animation-delay-200">
            Professional intensive home monitoring and expert care for successful ICU to home transition.
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
                <Card className="h-full border-gray-300 bg-white hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200 hover:scale-105">
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
