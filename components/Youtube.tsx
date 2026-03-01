


"use client";

import Video from "./Video";

const Youtube = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#f0f9ff]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Video Player */}
          <div className="relative flex items-center justify-center order-2 lg:order-1">
            <div className="w-full max-w-md">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-[#00b2ec]/30 shadow-2xl shadow-[#00b2ec]/20 hover:shadow-3xl hover:shadow-[#00b2ec]/30 transition-all duration-300">
                <Video src="https://www.youtube.com/watch?v=ynwXoTpE8mk" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center order-1 lg:order-2 max-w-lg">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00b2ec]/10 to-[#e50d92]/5 border border-[#00b2ec]/30 text-[#0088b8] px-4 py-2 rounded-full text-sm font-semibold mb-6 w-fit">
              <span className="w-2 h-2 bg-[#00b2ec] rounded-full animate-pulse"></span>
              Watch Our Story
            </div>

            {/* Main Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Why Trust
              <span className="text-[#00b2ec]"> LivingRite</span>
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">
              We've been providing compassionate, professional home healthcare services for over a decade. Our trained caregivers and medical staff are committed to delivering the highest quality care right in your home.
            </p>

            {/* Feature Points */}
            <div className="space-y-4 mb-10">
              {[
                {
                  icon: "✓",
                  title: "Expert Healthcare Professionals",
                  description: "Hospital-trained nurses and caregivers with years of experience",
                },
                {
                  icon: "✓",
                  title: "Personalized Care Plans",
                  description: "Customized treatment programs tailored to your specific needs",
                },
                {
                  icon: "✓",
                  title: "24/7 Support Available",
                  description: "Round-the-clock assistance and emergency response",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-white border border-[#00b2ec]/20 hover:bg-[#f0f9ff] hover:border-[#00b2ec]/40 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#00b2ec] to-[#0088b8] flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-[#00b2ec] to-[#0088b8] hover:from-[#0088b8] hover:to-[#00b2ec] text-white font-semibold rounded-full shadow-lg shadow-[#00b2ec]/30 hover:shadow-xl hover:shadow-[#00b2ec]/50 transition-all duration-300 hover:scale-105">
                Schedule a Consultation
              </button>
              <button className="px-8 py-3 border border-[#00b2ec]/40 text-[#0088b8] font-semibold rounded-full hover:bg-[#00b2ec]/5 hover:border-[#00b2ec]/60 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Youtube;