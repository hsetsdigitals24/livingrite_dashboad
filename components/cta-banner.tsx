import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRightFromCircle, CheckCircle, PhoneIcon } from "lucide-react";
import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-linear-to-br from-gray-50 via-primary/10 to-white">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-scale">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Ready to Get Started?
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up animation-delay-200">
            Ready to Provide the{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Best Care
            </span>{" "}
            for Your Loved One?
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-300">
            Book a free consultation today and discover how we can support your
            family's healthcare journey with compassion and expertise.
          </p>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-3 mb-12 max-w-2xl mx-auto">
            {[
              { icon: "✓", text: "No Commitment" },
              { icon: "✓", text: "20+ Families Served" },
              { icon: "✓", text: "Satisfaction Guaranteed" },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 justify-center animate-slide-up"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-gray-800 font-medium">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-600">
            <Link href="/client/booking" className="flex items-center">
              <Button
                size="lg"
                className="cursor-pointer text-base font-semibold bg-primary hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 group rounded-[2rem]"
              >
                Book Free Consultation
                <ArrowUpRightFromCircle className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="tel:+18001234567" className="flex items-center">
              <Button
                size="lg" 
                className="rounded-[2rem] bg-white border-1 border-primary text-primary cursor-pointer text-base font-semibold border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                <PhoneIcon className="mr-2 h-5 w-5" />
                Call Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Trust Message */}
        <div className="text-center mt-12 text-gray-400 text-sm animate-slide-up animation-delay-700">
          <p>✓ No commitment • 10+ families • Satisfaction guaranteed</p>
        </div>
      </div>
    </section>
  );
}
