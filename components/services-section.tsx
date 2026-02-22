import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Activity,
  Stethoscope,
  Heart,
  Home,
  Users,
  Zap,
  Building2,
  HeartPulse,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Activity,
    title: "Neurorehabilitation",
    description:
      "Specialized recovery support with experienced nurses trained in stroke rehabilitation.",
    color: "from-blue-100 to-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Stethoscope,
    title: "Post-ICU Recovery Care",
    description:
      "Comprehensive home care for patients transitioning from ICU, ensuring a smooth recovery with expert medical support.",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary/80",
  },
  {
    icon: HeartPulse,
    title: "Post-Surgical Care",
    description:
      "Expert post-operative care to ensure smooth recovery and prevent complications, with personalized care plans and 24/7 monitoring.",
    color: "from-green-100 to-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Heart,
    title: "End-of-Life and Palliative Care",
    description:
      "Compassionate palliative support focusing on comfort and dignity.",
    color: "from-rose-100 to-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: Home,
    title: "Geriatric Care",
    description:
      "Specialized care for seniors to maintain independence and quality of life.",
    color: "from-purple-100 to-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Zap,
    title: "Chronic Wound Care",
    description:
      "Specialized care for chronic wounds to promote healing and prevent complications.",
    color: "from-orange-100 to-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Building2,
    title: "Home Medical Consultations",
    description:
      "Skip the hospital wait time with comprehensive check-ups and medical reviews in the privacy of your home.",
    color: "from-indigo-100 to-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Users,
    title: "Postpartum Care",
    description:
      "Support for new mothers during the 'Fourth Trimester,' wound healing, breastfeeding guidance, & newborn monitoring.",
    color: "from-cyan-100 to-cyan-50",
    iconColor: "text-cyan-600",
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="py-20 lg:py-28 bg-linear-to-b from-white via-gray-50/50 to-white relative overflow-hidden"
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-scale">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up animation-delay-200">
            Comprehensive Care Services
          </h2>
          <p className="text-lg text-gray-700 animate-slide-up animation-delay-300">
            From post-acute care to long-term support, we provide specialized
            healthcare services tailored to your family's needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isPhysiotherapy = service.title === "Physiotherapy Sessions";
            const cardContent = (
              <div
                key={index}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <Card className="h-full border-gray-100 bg-white hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`h-6 w-6 ${service.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );

            if (isPhysiotherapy) {
              return (
                <a key={index} href="/physiotherapy" className="block">
                  {cardContent}
                </a>
              );
            }

            return cardContent;
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center"
          >
            <Button
              size="lg"
              className="font-semibold bg-primary hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-600 rounded-[2rem]"
            >
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
