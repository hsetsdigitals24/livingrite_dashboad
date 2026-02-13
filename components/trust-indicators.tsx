import { Award, Heart, Shield, Users } from "lucide-react"

const indicators = [
  {
    icon: Shield,
    title: "Certified Professionals",
    description: "Hospital-trained nurses and caregivers",
    metric: "98%",
  },
  {
    icon: Heart,
    title: "Compassionate Care",
    description: "Treating your loved ones like family",
    metric: "2000+",
  },
  {
    icon: Users,
    title: "Families Served",
    description: "Trusted across Nigeria and diaspora",
    metric: "10+",
  },
  {
    icon: Award,
    title: "Excellence Guaranteed",
    description: "Premium healthcare at home",
    metric: "24/7",
  },
]

export function TrustIndicators() {
  return (
    <section className="py-16 lg:py-20 bg-linear-to-br from-white to-gray-50 border-t border-b border-gray-200 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon
            return (
              <div
                key={index}
                className="group relative animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="border border-gray-300 rounded-2xl p-6 lg:p-8 backdrop-blur-sm bg-white hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 h-full">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:from-primary/30 transition-all duration-300">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">{indicator.metric}</div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">{indicator.title}</h3>
                    <p className="text-gray-600 text-xs lg:text-sm">{indicator.description}</p>
                  </div>

                  {/* Bottom Border Animation */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent rounded-b-2xl group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
