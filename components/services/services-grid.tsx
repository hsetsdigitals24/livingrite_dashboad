"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import {
  Activity,
  Stethoscope,
  HeartPulse,
  Heart,
  Home,
  Brain,
  Beaker, 
  Baby, 
  ArrowRight,
  Clock,
  Shield,
  Award,
  BriefcaseMedical,
  ArrowUpRightFromCircle,
} from "lucide-react";

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  slug: string;
  color: string;
  iconColor: string;
  features?: string[];
  index: number;
}

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  slug,
  color,
  iconColor,
  features = [],
  index,
}: ServiceCardProps) => {
  return (
    <Link href={`/services/${slug}`}>
      <Card
        className="h-full border-gray-700/50 bg-gray-900/90 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 cursor-pointer group animate-slide-up"
        style={{ animationDelay: `${index * 75}ms` }}
      >
        <CardContent className="p-8">
          {/* Icon */}
          <div
            className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${color} mb-6 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary/80 transition-colors">
            {title}
          </h3>
          <p className="text-gray-300 mb-6 leading-relaxed">{description}</p>

          {/* Features */}
          {features.length > 0 && (
            <div className="mb-6 space-y-2">
              {features.slice(0, 2).map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-gray-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>
                  {feature}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-2 text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
            Learn More
            <ArrowRight className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const services: Array<ServiceCardProps & { features: string[] }> = [
  {
    icon: Brain,
    title: "Neurorehabilitation Care",
    description:
      "Specialized care for stroke, brain injury, and neurological conditions with multidisciplinary team support.",
    slug: "neurorehabilitation",
    color: "from-purple-500/20 to-purple-500/10",
    iconColor: "text-purple-400",
    features: [
      "Neurocritical Specialists",
      "Physiotherapy & Speech Therapy",
      "24/7 Monitoring",
    ],
    index: 0,
  },
  {
    icon: Stethoscope,
    title: "Post-ICU Care",
    description:
      "Intensive home monitoring for patients transitioning from ICU with 24/7 supervision and expert care.",
    slug: "post-icu-care",
    color: "from-primary/20 to-primary/10",
    iconColor: "text-primary/80",
    features: [
      "Continuous Monitoring",
      "Vital Signs Tracking",
      "Emergency Support",
    ],
    index: 1,
  },
  {
    icon: HeartPulse,
    title: "Post-Surgical Care",
    description:
      "Professional post-surgical recovery support with doctors, nurses, and physiotherapists.",
    slug: "post-surgical-care",
    color: "from-blue-500/20 to-blue-500/10",
    iconColor: "text-blue-400",
    features: [
      "Wound Care Management",
      "Pain Management",
      "Recovery Monitoring",
    ],
    index: 2,
  },
  {
    icon: Heart,
    title: "End-of-Life & Palliative Care",
    description:
      "Compassionate palliative support focusing on comfort, dignity, and quality of life for patients and families.",
    slug: "end-of-life-care",
    color: "from-rose-500/20 to-rose-500/10",
    iconColor: "text-rose-400",
    features: ["Palliative Support", "Family Counseling", "Comfort Focus"],
    index: 3,
  },
  {
    icon: Activity,
    title: "Geriatric Care",
    description:
      "Professional elderly care with doctors and trained caregivers specialized in seniors' healthcare.",
    slug: "geriatric-care",
    color: "from-green-500/20 to-green-500/10",
    iconColor: "text-green-400",
    features: [
      "Chronic Disease Management",
      "Fall Prevention",
      "Daily Living Support",
    ],
    index: 4,
  },
  {
    icon: BriefcaseMedical,
    title: "Chronic Wound Care",
    description:
      "Expert chronic wound management and treatment at home with professional care.",
    slug: "chronic-wound-care",
    color: "from-orange-500/20 to-orange-500/10",
    iconColor: "text-orange-400",
    features: [
      "Advanced Dressings",
      "Infection Prevention",
      "Progress Monitoring",
    ],
    index: 5,
  },
  {
    icon: Home,
    title: "Home Medical Consultations",
    description:
      "Convenient doctor consultations in the comfort of your home with professional medical advice.",
    slug: "home-medical-consultations",
    color: "from-indigo-500/20 to-indigo-500/10",
    iconColor: "text-indigo-400",
    features: [
      "Doctor House Visits",
      "Health Assessments",
      "Quick Response",
    ],
    index: 6,
  },
  {
    icon: Beaker,
    title: "Routine Laboratory Services",
    description:
      "Professional laboratory blood tests and diagnostic services conducted at home.",
    slug: "routine-laboratory-services",
    color: "from-cyan-500/20 to-cyan-500/10",
    iconColor: "text-cyan-400",
    features: [
      "Home Blood Tests",
      "Quick Results",
      "Wide Test Range",
    ],
    index: 7,
  },
  {
    icon: HeartPulse,
    title: "Physiotherapy Services",
    description:
      "Professional physical therapy at home to restore mobility, strength, and independence.",
    slug: "physiotherapy-services",
    color: "from-emerald-500/20 to-emerald-500/10",
    iconColor: "text-emerald-400",
    features: ["Customized Programs", "Progress Tracking", "In-Home Therapy"],
    index: 8,
  },
  {
    icon: Baby,
    title: "Postpartum Care",
    description:
      "Comprehensive postpartum support for new mothers with professional guidance and care.",
    slug: "postpartum-care",
    color: "from-pink-500/20 to-pink-500/10",
    iconColor: "text-pink-400",
    features: [
      "Recovery Monitoring",
      "Lactation Support",
      "Newborn Care Guidance",
    ],
    index: 9,
  },
];

export function ServicesGrid() {
  return (
    <section className="py-20 lg:py-28 bg-white text-slate-900 via-slate-800/50 to-slate-900 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent mb-4 animate-slide-up animation-delay-200">
            Complete Care Solutions
          </h2>
          <p className="text-lg text-gray-900 animate-slide-up animation-delay-300">
            From acute recovery to long-term support, explore all our
            specialized healthcare services designed to provide comprehensive
            care for every need.
          </p>
        </div>


        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service) => (
            <ServiceCard key={service.slug} {...service} />
          ))}
        </div>

        {/* Care Packages and Service Tiers */}
        <div className="mt-20"> 
          {require("./care-packages-section").CarePackagesSection()}
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-20 pt-20 border-t border-gray-700/50">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-3xl text-primary  md:text-4xl font-bold mb-4 animate-slide-up">
              Why Choose Our Services?
            </h3>
            <p className="text-lg text-gray-700 animate-slide-up animation-delay-200">
              We combine expertise, compassion, and innovation to deliver the
              best care outcomes
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "24/7 Availability",
                description:
                  "Round-the-clock care and support whenever you need us, day or night.",
              },
              {
                icon: Shield,
                title: "Certified Professionals",
                description:
                  "Hospital-trained nurses and therapists with verified credentials and experience.",
              },
              {
                icon: Award,
                title: "Quality Assured",
                description:
                  "Evidence-based care practices with continuous monitoring and improvement.",
              },
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="group animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="bg-gray-900 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
                    <div className="inline-flex p-3 rounded-lg bg-primary/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary/80" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center animate-slide-up animation-delay-500">
          <p className="text-gray-600 mb-6">
            Ready to experience compassionate, professional healthcare?
          </p>
          <Link href="/client/booking" className="flex items-center mx-auto w-min cursor-pointer">
            <Button
              size="lg"
              className="text-base font-semibold bg-primary hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 group"
            >
              Book Your Free Consultation
              <ArrowUpRightFromCircle className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ServicesGrid;