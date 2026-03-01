"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const services = [
  {
    icon: "🧠",
    title: "Neurorehabilitation",
    description: "Specialized recovery support with experienced nurses trained in stroke rehabilitation.",
    color: "from-[#00b2ec]",
    borderColor: "border-[#00b2ec]",
  },
  {
    icon: "🏥",
    title: "Post-ICU Recovery Care",
    description: "Comprehensive home care for patients transitioning from ICU, ensuring smooth recovery.",
    color: "from-[#0088b8]",
    borderColor: "border-[#0088b8]",
  },
  {
    icon: "✨",
    title: "Post-Surgical Care",
    description: "Expert post-operative care to ensure smooth recovery with 24/7 monitoring.",
    color: "from-[#e50d92]",
    borderColor: "border-[#e50d92]",
  },
  {
    icon: "❤️",
    title: "End-of-Life & Palliative Care",
    description: "Compassionate palliative support focusing on comfort and dignity.",
    color: "from-[#d00a7f]",
    borderColor: "border-[#d00a7f]",
  },
  {
    icon: "👴",
    title: "Geriatric Care",
    description: "Specialized care for seniors to maintain independence and quality of life.",
    color: "from-[#00b2ec]",
    borderColor: "border-[#00b2ec]",
  },
  {
    icon: "🩹",
    title: "Chronic Wound Care",
    description: "Specialized care for chronic wounds to promote healing and prevent complications.",
    color: "from-[#e50d92]",
    borderColor: "border-[#e50d92]",
  },
  {
    icon: "🏠",
    title: "Home Medical Consultations",
    description: "Skip the hospital wait with comprehensive check-ups in the privacy of your home.",
    color: "from-[#0088b8]",
    borderColor: "border-[#0088b8]",
  },
  {
    icon: "👶",
    title: "Postpartum Care",
    description: "Support for new mothers during recovery, wound healing, and newborn monitoring.",
    color: "from-[#d00a7f]",
    borderColor: "border-[#d00a7f]",
  },
];

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className="py-20 lg:py-28 bg-gradient-to-br from-[#ffffff] via-[#f5fbff] to-[#faf7ff] relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00b2ec]/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-gradient-to-tr from-[#e50d92]/15 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-[#00b2ec]/10 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-6000"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00b2ec]/15 to-[#e50d92]/10 border border-[#00b2ec]/40 text-[#0088b8] px-4 py-3 rounded-full text-sm font-semibold mb-6 group hover:border-[#00b2ec]/60 hover:shadow-lg hover:shadow-[#00b2ec]/20 transition-all duration-300">
            <span className="w-2 h-2 bg-[#00b2ec] rounded-full animate-pulse"></span>
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Comprehensive Healthcare <br />
            <span className="bg-gradient-to-r from-[#00b2ec] via-[#0088b8] to-[#e50d92] bg-clip-text text-transparent animate-gradient-shift">
              Solutions
            </span>
          </h2>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Expert clinical care delivered to your home. From recovery management to specialized wellness programs, we provide professional healthcare right where you need it most.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card Background */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 cursor-pointer h-full overflow-hidden backdrop-blur-sm ${
                hoveredIndex === index 
                  ? `bg-white border-[#00b2ec] shadow-2xl` 
                  : 'bg-white/70 border-gray-200/60 shadow-md hover:shadow-xl'
              }`}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#00b2ec]/5 to-[#e50d92]/5 transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`text-5xl mb-4 transition-all duration-300 ${hoveredIndex === index ? 'scale-125 mb-6' : 'scale-100'}`}>
                    {service.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00b2ec] transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 font-light">
                    {service.description}
                  </p>

                  {/* Accent Line */}
                  <div className={`h-1 rounded-full transition-all duration-300 bg-gradient-to-r from-[#00b2ec] to-[#e50d92] w-0 ${hoveredIndex === index ? 'w-12' : 'w-0'}`}></div>
                </div>

                {/* Border Glow */}
                <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(0, 178, 236, 0.3) 0%, transparent 70%)`,
                    filter: 'blur(8px)',
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center animate-slide-up animation-delay-400">
          <p className="text-gray-700 mb-8 text-lg font-light">
            Ready to experience professional home healthcare?
          </p>
          <Link href="/client/booking">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#00b2ec] to-[#0088b8] hover:from-[#0088b8] hover:to-[#00b2ec] text-white shadow-xl shadow-[#00b2ec]/30 hover:shadow-2xl hover:shadow-[#00b2ec]/50 hover:scale-105 transition-all duration-300 rounded-full px-10 font-semibold text-base"
            >
              Schedule Your Care Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
