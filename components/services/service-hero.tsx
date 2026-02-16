import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import heroImage from "@/public/service-hero.jpg"

interface ServiceHeroProps {
  title: string
  description: string
  tagline?: string
}

export function ServiceHero({ title, description, tagline = "Professional Home Healthcare" }: ServiceHeroProps) {
  return (
    <section
      className="relative min-h-screen flex items-center pt-32 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-slate-900 bg-cover bg-center"
      style={{ backgroundImage: `url('${heroImage.src}')` }}
    >
         {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -ml-48 -mb-48" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80"></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center space-y-8">
          {/* Tagline */}
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {tagline}
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button size="lg" className="group">
              Book a Consultation
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
