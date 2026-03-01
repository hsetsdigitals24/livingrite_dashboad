import { Button } from "@/components/ui/button";
import { ArrowUpRightFromCircle, CheckCircle, Phone, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#f5fbff] to-[#faf7ff]">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00b2ec]/25 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-tr from-[#e50d92]/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-gradient-to-r from-[#00b2ec]/15 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-6000"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Content */}
          <div className="relative bg-gradient-to-br from-[#00b2ec]/8 via-white to-[#e50d92]/5 rounded-3xl border border-[#00b2ec]/30 p-12 lg:p-20 shadow-2xl shadow-[#00b2ec]/15 backdrop-blur-sm hover:shadow-3xl hover:shadow-[#00b2ec]/25 transition-all duration-500 animate-slide-up">
            {/* Decorative gradient corners */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-bl from-[#e50d92]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-[#00b2ec]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>

            <div className="relative z-10 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00b2ec]/15 to-[#e50d92]/10 border border-[#00b2ec]/40 text-[#0088b8] px-5 py-3 rounded-full text-sm font-semibold mb-8 animate-fade-in-scale group hover:border-[#00b2ec]/60 hover:shadow-lg hover:shadow-[#00b2ec]/20 transition-all duration-300">
                <Sparkles className="h-4 w-4" />
                <span>Ready to Get Started?</span>
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight animate-slide-up animation-delay-200">
                Transform Your Family's
                <br />
                <span className="bg-gradient-to-r from-[#00b2ec] via-[#0088b8] to-[#e50d92] bg-clip-text text-transparent animate-gradient-shift">
                  Healthcare Journey
                </span>
              </h2>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-300 font-light">
                Schedule your free consultation today. Our specialists will listen to your needs, answer your questions, and create a personalized care plan for your loved one.
              </p>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-14 animate-slide-up animation-delay-400">
                <div className="flex items-start gap-4 group/benefit">
                  <CheckCircle className="h-6 w-6 text-[#00b2ec] shrink-0 mt-0.5 group-hover/benefit:text-[#e50d92] transition-colors duration-300" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 group-hover/benefit:text-[#00b2ec] transition-colors duration-300">Free 30-Min Consultation</p>
                    <p className="text-sm text-gray-600 font-light">No hidden fees or commitments</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group/benefit">
                  <CheckCircle className="h-6 w-6 text-[#e50d92] shrink-0 mt-0.5 group-hover/benefit:text-[#00b2ec] transition-colors duration-300" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 group-hover/benefit:text-[#e50d92] transition-colors duration-300">Expert Assessment</p>
                    <p className="text-sm text-gray-600 font-light">Personalized care recommendations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group/benefit">
                  <CheckCircle className="h-6 w-6 text-[#00b2ec] shrink-0 mt-0.5 group-hover/benefit:text-[#e50d92] transition-colors duration-300" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 group-hover/benefit:text-[#00b2ec] transition-colors duration-300">24/7 Ongoing Support</p>
                    <p className="text-sm text-gray-600 font-light">Always available when you need us</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-500">
                <Link href="/client/booking" className="group/btn">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#00b2ec] to-[#0088b8] hover:from-[#0088b8] hover:to-[#00b2ec] text-white shadow-xl shadow-[#00b2ec]/30 hover:shadow-2xl hover:shadow-[#00b2ec]/50 hover:scale-105 transition-all duration-300 rounded-full px-10 font-semibold text-base"
                  >
                    <span className="flex items-center gap-2">
                      Book Your Consultation
                      <ArrowUpRightFromCircle className="h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:translate-y-[-2px] transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
                <a href="tel:+234" className="group/btn">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-[#0088b8] border-[#00b2ec]/40 hover:bg-[#00b2ec]/5 hover:border-[#00b2ec]/60 rounded-full px-10 font-semibold transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Call Now
                    </span>
                  </Button>
                </a>
              </div>

              {/* Testimonial Quote */}
              <div className="mt-12 pt-12 border-t border-gray-300">
                <p className="text-gray-700 italic text-center font-light mb-2">
                  "LivingRite Care transformed my mother's recovery journey. The nurses are skilled and genuinely caring."
                </p>
                <p className="text-sm text-[#0088b8] font-semibold">— Chioma Okafor, Lagos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
