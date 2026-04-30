import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowUpRightFromCircle } from "lucide-react";
import Link from "next/link";
import sectionImage from "@/public/african-nurse-caring-for-elderly-patient-at-home--.jpg";
const values = [
  "Hospital-trained nurses with years of experience",
  "Personalized care plans for every patient",
  "Real-time updates for family members",
  "Affordable pricing with transparent costs",
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-gradient-to-br from-[#ffffff] via-[#f5fbff] to-[#faf7ff] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-96 h-96 bg-gradient-to-bl from-[#00b2ec]/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 left-0 w-96 h-96 bg-gradient-to-tr from-[#e50d92]/15 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative animate-slide-up animation-delay-200">
            <div className="aspect-4/3 rounded-3xl overflow-hidden bg-gradient-to-br from-[#00b2ec]/10 to-[#e50d92]/5 backdrop-blur-sm border border-[#00b2ec]/30 shadow-2xl shadow-[#00b2ec]/25 hover:shadow-3xl hover:shadow-[#00b2ec]/40 transition-all duration-500">
              <img
                src={sectionImage.src}
                alt="Professional caregiver with elderly patient"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Stat Card */}
            <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-[#00b2ec] to-[#0088b8] text-white p-8 rounded-3xl shadow-2xl shadow-[#00b2ec]/40 max-w-xs border border-[#00b2ec]/40 animate-float hover:shadow-3xl hover:shadow-[#00b2ec]/60 transition-all duration-300">
              <div className="text-5xl font-black mb-2">98%</div>
              <div className="text-sm font-semibold opacity-95">Client Satisfaction</div>
              <div className="text-xs opacity-80 mt-2">Based on patient feedback</div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-8 -left-8 w-24 h-24 border-2 border-[#e50d92]/20 rounded-2xl opacity-40"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-[#00b2ec]/15 rounded-full opacity-30"></div>
          </div>

          {/* Content Side */}
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00b2ec]/15 to-[#e50d92]/10 border border-[#00b2ec]/40 text-[#0088b8] px-4 py-3 rounded-full text-sm font-semibold mb-6 animate-fade-in-scale group hover:border-[#00b2ec]/60 hover:shadow-lg hover:shadow-[#00b2ec]/20 transition-all duration-300">
              <span className="w-2 h-2 bg-[#00b2ec] rounded-full animate-pulse"></span>
              About LivingRite Care
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight animate-slide-up animation-delay-300">
              Professional Care for <br />
              <span className="bg-gradient-to-r from-[#00b2ec] via-[#0088b8] to-[#e50d92] bg-clip-text text-transparent animate-gradient-shift">
                Your Journey
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed animate-slide-up animation-delay-400 font-light">
              Hospital discharge is just the beginning. We are a team of neuro-specialists and educators dedicated to reimagining out-of-hospital recovery. By combining evidence-led rehabilitation with compassionate caregiver coaching, we nurture you back to health in the place you feel safest.
            </p>

            {/* Value Props */}
            <div className="space-y-4 mb-10 animate-slide-up animation-delay-500">
              {values.map((value, index) => (
                <div key={index} className="flex items-start gap-4 group/value">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-6 w-6 text-[#00b2ec] group-hover/value:text-[#e50d92] group-hover/value:scale-125 transition-all duration-300" />
                  </div>
                  <span className="text-gray-700 text-base font-light group-hover/value:text-gray-900 transition-colors duration-300">{value}</span>
                </div>
              ))}
            </div>

            {/* Feature Stats */}
            <div className="grid grid-cols-2 gap-6 mb-10 py-8 border-t border-b border-gray-200/50 animate-slide-up animation-delay-600">
              <div className="group/stat">
                <div className="text-4xl font-black text-[#00b2ec] group-hover/stat:text-[#e50d92] transition-colors duration-300 mb-2">10+</div>
                <div className="text-sm text-gray-600 font-light">Years Experience</div>
              </div>
              <div className="group/stat">
                <div className="text-4xl font-black text-[#e50d92] group-hover/stat:text-[#00b2ec] transition-colors duration-300 mb-2">50+</div>
                <div className="text-sm text-gray-600 font-light">Families Served</div>
              </div>
            </div>

            <Link
              href="/client/booking"
              className="inline-flex items-center gap-2 animate-slide-up animation-delay-700 group/cta"
            >
              <Button
                size="lg"
                className="font-semibold bg-gradient-to-r from-[#00b2ec] to-[#0088b8] hover:from-[#0088b8] hover:to-[#00b2ec] text-white shadow-xl shadow-[#00b2ec]/30 hover:shadow-2xl hover:shadow-[#00b2ec]/50 hover:scale-105 transition-all duration-300 rounded-full px-10"
              >
                Start Your Recovery Plan
                <ArrowUpRightFromCircle className="ml-2 h-5 w-5 group-hover/cta:translate-x-1 group-hover/cta:translate-y-[-2px] transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
