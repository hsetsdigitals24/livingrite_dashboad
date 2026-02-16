import { Activity, Stethoscope, HeartPulse, Heart, Home, Zap, Building2, Users } from "lucide-react"
import Link from "next/link"

const services = [
  { slug: "post-stroke-care", name: "Post-Stroke", icon: Activity },
  { slug: "post-icu-care", name: "Post-ICU", icon: Stethoscope },
  { slug: "physiotherapy-sessions", name: "Physiotherapy", icon: HeartPulse },
  { slug: "live-in-nursing", name: "Live-in Nursing", icon: Home },
  { slug: "rehabilitation-support", name: "Rehabilitation", icon: Zap },
  { slug: "end-of-life-care", name: "End-of-Life", icon: Heart },
  { slug: "corporate-wellness", name: "Corporate", icon: Building2 },
  { slug: "family-support", name: "Family Support", icon: Users },
]

export function ServiceSwitcher() {
  return (
    <div className="sticky top-20 z-30 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium whitespace-nowrap">{service.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
