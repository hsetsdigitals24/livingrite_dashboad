"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface ServiceDetailProps {
  title: string
  slug: string
  shortDescription: string
  longDescription: string
  benefits: string[]
  features: string[]
  idealFor: string[]
  cta?: string
}

const serviceDetails: Record<string, ServiceDetailProps> = {
  "post-stroke-care": {
    title: "Post-Stroke Care",
    slug: "post-stroke-care",
    shortDescription: "Specialized recovery support with experienced nurses trained in stroke rehabilitation",
    longDescription:
      "Stroke recovery is a journey that requires specialized knowledge, patience, and compassionate care. At Living Rite Care, we provide comprehensive post-stroke care services designed to maximize recovery potential and restore independence. Our experienced nurses and therapists work together to create personalized rehabilitation programs that address each patient's unique needs, from mobility and speech therapy to cognitive recovery and emotional support.",
    benefits: [
      "Accelerated Recovery Timeline",
      "Improved Mobility & Strength",
      "Enhanced Independence in Daily Activities",
      "Reduced Risk of Complications",
      "Professional Monitoring & Support",
      "Family Education & Involvement",
      "Customized Rehabilitation Plans",
      "Ongoing Progress Assessment",
    ],
    features: [
      "Hospital-trained stroke specialists",
      "24/7 monitoring and support",
      "Physical and occupational therapy",
      "Speech and language therapy",
      "Medication management",
      "Nutrition counseling",
      "Family training and education",
      "Progress tracking and reporting",
    ],
    idealFor: [
      "Recent stroke patients (0-6 months post-event)",
      "Patients with mobility limitations",
      "Those requiring speech rehabilitation",
      "Patients needing cognitive recovery support",
      "Anyone transitioning from hospital care",
    ],
  },
  "post-icu-care": {
    title: "Post-ICU Care",
    slug: "post-icu-care",
    shortDescription: "Intensive home monitoring for patients transitioning from ICU with 24/7 supervision",
    longDescription:
      "ICU-level care doesn't have to end at hospital discharge. Our post-ICU care services provide the intensive, professional monitoring and support that patients need during their critical transition home. We maintain hospital-grade standards of care in the comfort and familiarity of home, with 24/7 availability, continuous vital monitoring, and experienced nurses who specialize in post-critical illness care.",
    benefits: [
      "Safe Hospital-to-Home Transition",
      "Continuous Vital Monitoring",
      "Immediate Emergency Response",
      "Reduced Hospital Readmission Risk",
      "Faster Recovery to Independence",
      "Family Peace of Mind",
      "Coordinated Care with Specialists",
      "Detailed Medical Documentation",
    ],
    features: [
      "24/7 registered nurse supervision",
      "Continuous vital signs monitoring",
      "Medical equipment management",
      "Medication administration and tracking",
      "Wound and catheter care",
      "Nutritional support and feeding",
      "Emergency protocols and response",
      "Hospital and specialist coordination",
    ],
    idealFor: [
      "Recent ICU discharge patients",
      "Patients on ventilators or oxygen support",
      "Those with complex medical needs",
      "Patients requiring intensive monitoring",
      "Anyone recovering from critical illness",
    ],
  },
  "physiotherapy-sessions": {
    title: "Physiotherapy Sessions",
    slug: "physiotherapy-sessions",
    shortDescription: "Professional physical therapy at home to restore mobility and independence",
    longDescription:
      "Physiotherapy is crucial for recovery from injury, surgery, or illness. Our in-home physiotherapy services bring professional therapy directly to you, eliminating travel challenges while providing personalized, one-on-one care. Our licensed physiotherapists create evidence-based treatment plans tailored to your specific condition and goals, helping you regain strength, mobility, and confidence.",
    benefits: [
      "Improved Mobility & Flexibility",
      "Increased Strength & Endurance",
      "Pain Reduction",
      "Enhanced Balance & Coordination",
      "Greater Independence",
      "Faster Recovery from Injury",
      "Prevention of Complications",
      "Personalized Attention",
    ],
    features: [
      "Licensed physiotherapists",
      "Customized exercise programs",
      "Manual therapy and stretching",
      "Functional mobility training",
      "Home exercise routines",
      "Progress tracking and adjustments",
      "Equipment setup and safety",
      "Family education and support",
    ],
    idealFor: [
      "Post-surgical patients",
      "Stroke and neurological condition patients",
      "Orthopedic injury patients",
      "Elderly patients with mobility issues",
      "Sports injury recovery patients",
    ],
  },
  "end-of-life-care": {
    title: "End-of-Life Care",
    slug: "end-of-life-care",
    shortDescription: "Compassionate palliative support focusing on comfort and dignity",
    longDescription:
      "When curative treatment is no longer the focus, comfort and dignity become paramount. Our end-of-life care services provide compassionate, holistic support for patients and their families during this significant journey. We focus on pain management, emotional support, spiritual care, and helping families create meaningful memories while ensuring the highest standards of comfort and respect.",
    benefits: [
      "Expert Pain & Symptom Management",
      "Emotional & Spiritual Support",
      "Family Involvement & Education",
      "Dignified, Comfortable Care",
      "Personalized Care Plans",
      "Bereavement Support",
      "Peace of Mind",
      "Meaningful Time Together",
    ],
    features: [
      "Specialized palliative care nurses",
      "Advanced pain management",
      "Emotional and spiritual counseling",
      "Family support and guidance",
      "Comfort care protocols",
      "24/7 availability and support",
      "Bereavement follow-up",
      "Medical equipment as needed",
    ],
    idealFor: [
      "Advanced illness patients",
      "Terminal condition patients",
      "Patients choosing comfort-focused care",
      "Those with complex symptoms",
      "Families seeking compassionate support",
    ],
  },
  "live-in-nursing": {
    title: "Live-in Nursing",
    slug: "live-in-nursing",
    shortDescription: "Round-the-clock professional nursing care with dedicated caregivers",
    longDescription:
      "Some patients require comprehensive, continuous care that goes beyond periodic visits. Our live-in nursing service provides 24/7 professional care from dedicated nurses who become integral members of your household. This arrangement ensures immediate response to medical needs, consistent care routines, and the peace of mind that comes with having trained medical professionals always present.",
    benefits: [
      "24/7 Medical Supervision",
      "Immediate Care Response",
      "Comprehensive Assistance",
      "Consistent Care Relationships",
      "Reduced Hospital Visits",
      "Enhanced Quality of Life",
      "Family Support & Respite",
      "Continuous Monitoring",
    ],
    features: [
      "Dedicated live-in nurse",
      "Round-the-clock care availability",
      "Complete personal care assistance",
      "Medication management",
      "Meal preparation and nutrition",
      "Household management support",
      "Medical emergency response",
      "Backup coverage for days off",
    ],
    idealFor: [
      "Patients with complex medical needs",
      "Those requiring 24/7 assistance",
      "Post-operative recovery patients",
      "Patients with multiple chronic conditions",
      "Those desiring consistent caregiver",
    ],
  },
  "rehabilitation-support": {
    title: "Rehabilitation Support",
    slug: "rehabilitation-support",
    shortDescription: "Comprehensive rehab programs for post-surgery and injury recovery",
    longDescription:
      "Rehabilitation is the bridge between injury or surgery and return to normal life. Our comprehensive rehabilitation support services provide structured, evidence-based programs designed to safely rebuild strength, restore function, and help you return to the activities you love. Whether recovering from surgery, injury, or illness, our team creates personalized pathways to success.",
    benefits: [
      "Faster Functional Recovery",
      "Progressive Strength Building",
      "Safe Return to Activities",
      "Reduced Pain & Discomfort",
      "Improved Confidence",
      "Prevention of Re-injury",
      "Customized Progress Pacing",
      "Expert Guidance Throughout",
    ],
    features: [
      "Physical therapist assessment",
      "Personalized rehab programs",
      "Progressive exercise protocols",
      "Equipment provision and setup",
      "Functional activity training",
      "Return-to-work assistance",
      "Regular progress evaluation",
      "Ongoing program adjustment",
    ],
    idealFor: [
      "Post-surgical patients",
      "Injury recovery patients",
      "Athletes returning to sport",
      "Stroke and neurological patients",
      "Orthopedic recovery patients",
    ],
  },
  "corporate-wellness": {
    title: "Corporate Wellness",
    slug: "corporate-wellness",
    shortDescription: "Employee wellness programs and organizational health consultations",
    longDescription:
      "Employee wellness is an investment in your company's future. Our corporate wellness programs are designed to improve employee health, reduce absenteeism, increase productivity, and create a positive workplace culture. We provide customized solutions that meet your organization's unique needs and goals, from health screenings to wellness education and ongoing support.",
    benefits: [
      "Improved Employee Health",
      "Reduced Absenteeism",
      "Increased Productivity",
      "Lower Healthcare Costs",
      "Enhanced Company Culture",
      "Improved Employee Morale",
      "Reduced Stress & Burnout",
      "Better Retention Rates",
    ],
    features: [
      "Customized wellness programs",
      "Health screenings and assessments",
      "Fitness and nutrition consultations",
      "Stress management workshops",
      "Mental health resources",
      "Health education seminars",
      "Virtual and in-person options",
      "Progress tracking and reporting",
    ],
    idealFor: [
      "Organizations prioritizing employee wellness",
      "Companies with remote teams",
      "Businesses seeking cost reduction",
      "Organizations promoting healthy culture",
      "Companies with diverse employee needs",
    ],
  },
  "family-support": {
    title: "Family Support",
    slug: "family-support",
    shortDescription: "Respite care and counseling to help caregivers maintain their wellbeing",
    longDescription:
      "Caring for a loved one can be rewarding but also emotionally and physically demanding. Our family support services recognize that caregiver wellbeing is essential for quality patient care. We provide respite care, professional counseling, education, and practical support to help primary caregivers maintain their health and resilience while their loved one receives professional care.",
    benefits: [
      "Caregiver Respite & Rest",
      "Reduced Caregiver Stress",
      "Professional Support & Guidance",
      "Practical Coping Strategies",
      "Improved Family Relationships",
      "Better Patient Care Outcomes",
      "Emotional Support",
      "Community Connection",
    ],
    features: [
      "Temporary respite care services",
      "Professional counseling",
      "Support groups and peer connections",
      "Caregiver education and training",
      "Stress management resources",
      "Care planning assistance",
      "Emergency backup support",
      "Bereavement support services",
    ],
    idealFor: [
      "Primary caregivers",
      "Family members experiencing caregiver stress",
      "Those needing respite time",
      "Families adjusting to care requirements",
      "Anyone supporting a chronically ill loved one",
    ],
  },
}

export function ServiceDetail({ slug }: { slug: string }) {
  const service = serviceDetails[slug]

  if (!service) return null

  return (
    <section className="py-20 lg:py-28 bg-linear-to-b from-slate-800/50 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Back Link */}
        <Link href="/services" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group animate-slide-up">
          <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" />
          Back to Services
        </Link>

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-slide-up animation-delay-200">
            {service.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-slide-up animation-delay-300">
            {service.shortDescription}
          </p>

          {/* CTA Button */}
          <Link href="/booking">
            <Button
              size="lg"
              className="text-base font-semibold bg-primary hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 group animate-slide-up animation-delay-400"
            >
              Book Free Consultation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {/* Left Column - Description */}
          <div className="lg:col-span-2 animate-slide-up animation-delay-300">
            <Card className="border-gray-700/50 bg-linear-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">About This Service</h2>
                <p className="text-gray-300 leading-relaxed mb-6">{service.longDescription}</p>
              </CardContent>
            </Card>

            {/* Benefits Section */}
            <Card className="border-gray-700/50 bg-linear-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Key Benefits</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 animate-slide-up animation-delay-400">
            {/* Features Card */}
            <Card className="border-gray-700/50 bg-linear-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {service.features.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></span>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Ideal For Card */}
            <Card className="bg-linear-to-br from-primary/10 to-primary/5 backdrop-blur-sm border-primary/30">
              <CardContent className="pt-8">
                <h3 className="text-lg font-bold text-primary/80 mb-4">Ideal For</h3>
                <ul className="space-y-2">
                  {service.idealFor.map((ideal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                      <span className="text-sm text-gray-300">{ideal}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
