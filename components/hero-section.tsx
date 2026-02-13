import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen lg:min-h-175 flex items-center pt-20 overflow-hidden bg-linear-to-br from-gray-50 via-primary/10 to-white">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-slide-up animation-delay-200">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Nigeria's Premier Home Healthcare Service
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up animation-delay-300">
              Expert Post-Hospital Care in the{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Comfort of Home
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl animate-slide-up animation-delay-400">
              Professional home healthcare services for post-stroke recovery,
              ICU care, physiotherapy, and palliative support. Hospital-trained
              nurses delivering compassionate care for your loved ones.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up animation-delay-500">
              <Link href="/booking" className="flex items-center">
                <Button
                  size="lg"
                  className="text-base font-semibold bg-primary hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 group"
                >
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/training" className="flex items-center">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base font-semibold border-2 border-gray-300 text-gray-800 hover:bg-gray-100 backdrop-blur-sm transition-all duration-300"
                >
                  Explore our Caregiver Training Academy
                  <ChevronRight className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-xl animate-slide-up animation-delay-600">
              <div className="border-l-2 border-primary pl-4">
                <div className="text-3xl font-bold text-primary mb-1">10+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="border-l-2 border-accent pl-4">
                <div className="text-3xl font-bold text-accent mb-1">2000+</div>
                <div className="text-sm text-gray-600">Families Served</div>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-gray-400">Care Available</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:flex items-center justify-center relative animate-slide-up animation-delay-300">
            {/* Video Card */}
            <div className="relative w-full max-w-md">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-white/10 overflow-hidden shadow-2xl">
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16 p-0 bg-primary hover:bg-primary/90 hover:scale-110 transition-all duration-300 shadow-2xl shadow-primary/50"
                  >
                    <Play className="h-6 w-6 fill-white" />
                  </Button>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl animate-float">
                <div className="text-sm font-semibold text-white">
                  Expert Care
                </div>
                <div className="text-xs text-gray-300">
                  Hospital-trained staff
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl animate-float animation-delay-200">
                <div className="text-sm font-semibold text-white">
                  Available 24/7
                </div>
                <div className="text-xs text-gray-300">Always here for you</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-400">Scroll to explore</span>
            <div className="w-1 h-6 rounded-full border-2 border-primary flex justify-center">
              <div className="w-0.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
