import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"

const values = [
  "Hospital-trained nurses with 10+ years experience",
  "Personalized care plans for every patient",
  "Real-time updates for family members",
  "Affordable pricing with transparent costs",
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-linear-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-40 left-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative animate-slide-up animation-delay-200">
            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-linear-to-br from-gray-200/40 to-gray-300/40 backdrop-blur-sm border border-gray-400/50">
              <img
                src="/african-nurse-caring-for-elderly-patient-at-home--.jpg"
                alt="Professional caregiver with elderly patient"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 bg-primary text-white p-6 rounded-2xl shadow-2xl shadow-primary/30 max-w-xs border border-primary/20 animate-float">
              <div className="text-4xl font-bold mb-1">98%</div>
              <div className="text-sm opacity-90">Client Satisfaction Rate</div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-scale">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              About LivingRite Care
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up animation-delay-300">
              Nigeria's Trusted Partner in <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Home Healthcare</span>
            </h2>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed animate-slide-up animation-delay-400">
              Founded to bridge Nigeria's post-acute care gap, LivingRite Care brings hospital-quality medical services
              directly to your home. We understand the challenges families face when caring for recovering loved ones.
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed animate-slide-up animation-delay-500">
              Our mission is simple: provide compassionate, professional healthcare that allows patients to recover in
              the comfort and dignity of their own homes, while giving families peace of mind through real-time updates
              and transparent communication.
            </p>

            {/* Value Props */}
            <div className="space-y-4 mb-8 animate-slide-up animation-delay-600">
              {values.map((value, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="font-semibold bg-primary hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-700 group">
              Read Our Story
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
