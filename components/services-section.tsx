import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Stethoscope, Heart, Home, Users, Zap, Building2, HeartPulse } from "lucide-react"

const services = [
  {
    icon: Activity,
    title: "Post-Stroke Care",
    description: "Specialized recovery support with experienced nurses trained in stroke rehabilitation.",
    color: "from-blue-100 to-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Stethoscope,
    title: "Post-ICU Care",
    description: "Intensive home monitoring for patients transitioning from ICU with 24/7 supervision.",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary/80",
  },
  {
    icon: HeartPulse,
    title: "Physiotherapy Sessions",
    description: "Professional physical therapy at home to restore mobility and independence.",
    color: "from-green-100 to-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Heart,
    title: "End-of-Life Care",
    description: "Compassionate palliative support focusing on comfort and dignity.",
    color: "from-rose-100 to-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: Home,
    title: "Live-in Nursing",
    description: "Round-the-clock professional nursing care with dedicated caregivers.",
    color: "from-purple-100 to-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Zap,
    title: "Rehabilitation Support",
    description: "Comprehensive rehab programs for post-surgery and injury recovery.",
    color: "from-orange-100 to-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Building2,
    title: "Corporate Wellness",
    description: "Employee wellness programs and organizational health consultations.",
    color: "from-indigo-100 to-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Users,
    title: "Family Support",
    description: "Respite care and counseling to help caregivers maintain their wellbeing.",
    color: "from-cyan-100 to-cyan-50",
    iconColor: "text-cyan-600",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-linear-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-scale">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up animation-delay-200">
            Comprehensive Care Services
          </h2>
          <p className="text-lg text-gray-700 animate-slide-up animation-delay-300">
            From post-acute care to long-term support, we provide specialized healthcare services tailored to your family's needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon
            const isPhysiotherapy = service.title === "Physiotherapy Sessions"
            const cardContent = (
              <div
                key={index}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <Card className="h-full border-gray-300 bg-white hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${service.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">{service.description}</p>
                    <button className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all hover:text-primary/80">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              </div>
            )

            if (isPhysiotherapy) {
              return (
                <a key={index} href="/physiotherapy" className="block">
                  {cardContent}
                </a>
              )
            }

            return cardContent
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Button size="lg" className="font-semibold bg-primary hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-600">
            View All Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
