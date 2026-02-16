import { PostICUHero } from "@/components/post-icu/post-icu-hero"
import { PostICUFeatures } from "@/components/post-icu/post-icu-features"
import { TransitionCare } from "@/components/post-icu/transition-care"
import { PhysiotherapyHero } from "@/components/physiotherapy-sessions/physiotherapy-hero"
import { PhysiotherapyFeatures } from "@/components/physiotherapy-sessions/physiotherapy-features"
import { SessionTypes } from "@/components/physiotherapy-sessions/session-types"
import { ServiceHero } from "@/components/services/service-hero"
import { ServiceFeatures } from "@/components/services/service-features"
import { ServiceDetailContent } from "@/components/services/service-detail-content"
import type { Metadata } from "next"

export async function generateStaticParams() {
  return [
    { slug: "neurorehabilitation" },
    { slug: "post-icu-care" },
    { slug: "post-surgical-care" },
    { slug: "end-of-life-care" },
    { slug: "geriatric-care" },
    { slug: "chronic-wound-care" },
    { slug: "home-medical-consultations" },
    { slug: "routine-laboratory-services" },
    { slug: "physiotherapy-services" },
    { slug: "postpartum-care" },
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const titles: Record<string, string> = {
    "neurorehabilitation": "Neurorehabilitation Care | Expert Stroke & Brain Injury Recovery - Living Rite Care",
    "post-icu-care": "Post-ICU Care | 24/7 Home Monitoring - Living Rite Care",
    "post-surgical-care": "Post-Surgical Care | Professional Recovery Support - Living Rite Care",
    "end-of-life-care": "End-of-Life & Palliative Care | Compassionate Support - Living Rite Care",
    "geriatric-care": "Geriatric Care | Elderly Home Healthcare - Living Rite Care",
    "chronic-wound-care": "Chronic Wound Care | Professional Home Treatment - Living Rite Care",
    "home-medical-consultations": "Home Medical Consultations | Doctor Visits at Home - Living Rite Care",
    "routine-laboratory-services": "Laboratory Services | Home Blood Tests - Living Rite Care",
    "physiotherapy-services": "Physiotherapy Services | Physical Therapy at Home - Living Rite Care",
    "postpartum-care": "Postpartum Care | New Mother Support - Living Rite Care",
  }

  const descriptions: Record<string, string> = {
    "neurorehabilitation": "Specialized neurorehabilitation care with neurocritical doctors, nurses, physiotherapists, and specialists. Comprehensive support for stroke and brain injury recovery.",
    "post-icu-care": "Intensive post-ICU home care with continuous monitoring. Safe hospital-to-home transition with specialized professional support.",
    "post-surgical-care": "Professional post-surgical recovery support with doctors, nurses, and physiotherapists. Comprehensive care tailored to surgical complexity.",
    "end-of-life-care": "Compassionate palliative and hospice care focusing on comfort, dignity, and quality of life. Support for patients and families.",
    "geriatric-care": "Professional elderly care with doctors and trained caregivers. Specialized support for seniors' unique medical and daily living needs.",
    "chronic-wound-care": "Expert chronic wound management and treatment at home. Professional care to promote healing and prevent complications.",
    "home-medical-consultations": "Convenient doctor consultations in the comfort of your home. Professional medical advice without hospital visits.",
    "routine-laboratory-services": "Laboratory blood tests and routine services conducted at home. Professional and convenient healthcare diagnostics.",
    "physiotherapy-services": "Professional physical therapy at home. Restore mobility, strength, and independence with certified physiotherapists.",
    "postpartum-care": "Comprehensive postpartum support for new mothers. Professional guidance for recovery and newborn care.",
  }

  return {
    title: titles[slug] || "Service - Living Rite Care",
    description: descriptions[slug] || "Professional home healthcare services",
  }
}

interface ServiceConfig {
  slug: string
  title: string
  description: string
  components: React.ReactNode[]
  processType: string
  faqType: string
}

const serviceConfigs: Record<string, ServiceConfig> = {
  "neurorehabilitation": {
    slug: "neurorehabilitation",
    title: "Neurorehabilitation Care",
    description: "Specialized care for stroke, brain injury, and neurological conditions with multidisciplinary team support.",
    components: [
      <ServiceHero key="hero" title="Neurorehabilitation Care" description="Expert neurological care with specialists, nurses, physiotherapists, and speech therapists for comprehensive recovery support." />,
      <ServiceFeatures key="features" title="Our Care Team" features={[
        { title: "Neurocritical Specialists", description: "Board-certified doctors specialized in neurological critical care and recovery" },
        { title: "Physiotherapists", description: "Certified professionals for mobility and movement rehabilitation" },
        { title: "Speech Therapists", description: "Specialists for communication and swallowing rehabilitation" },
        { title: "Nutritionists", description: "Professional nutrition management for optimal recovery" },
        { title: "Nursing Support", description: "24/7 registered nurses and nursing assistants" },
        { title: "Personalized Plans", description: "Customized recovery programs tailored to individual needs" },
      ]} />,
      <TransitionCare key="transition" />,
    ],
    processType: "neurorehabilitation",
    faqType: "neurorehabilitation",
  },
  "post-icu-care": {
    slug: "post-icu-care",
    title: "Post-ICU Care",
    description: "Intensive home monitoring for patients transitioning from ICU with 24/7 supervision and expert care.",
    components: [<PostICUHero key="hero" />, <PostICUFeatures key="features" />, <TransitionCare key="transition" />],
    processType: "post-icu-care",
    faqType: "post-icu-care",
  },
  "post-surgical-care": {
    slug: "post-surgical-care",
    title: "Post-Surgical Care",
    description: "Professional post-surgical recovery support with doctors, nurses, and physiotherapists.",
    components: [
      <ServiceHero key="hero" title="Post-Surgical Care" description="Comprehensive recovery support designed for safe healing and optimal outcomes following surgery." />,
      <ServiceFeatures key="features" title="Surgical Recovery Support" features={[
        { title: "Surgical Specialists", description: "Doctors experienced in post-operative care and complications management" },
        { title: "Wound Care", description: "Professional wound management and infection prevention" },
        { title: "Pain Management", description: "Comfortable recovery with professional pain control" },
        { title: "Physiotherapy", description: "Early mobilization and rehabilitation for faster recovery" },
        { title: "Nutritional Support", description: "Specialized nutrition to support healing and strength recovery" },
        { title: "24/7 Monitoring", description: "Continuous observation for early detection of complications" },
      ]} />,
      <TransitionCare key="transition" />,
    ],
    processType: "post-surgical-care",
    faqType: "post-surgical-care",
  },
  "end-of-life-care": {
    slug: "end-of-life-care",
    title: "End-of-Life & Palliative Care",
    description: "Compassionate palliative support focusing on comfort, dignity, and quality of life for patients and families.",
    components: [
      <ServiceHero key="hero" title="End-of-Life & Palliative Care" description="Compassionate care focusing on comfort, dignity, and quality of life. Professional support for patients and families during this important time." />,
      <ServiceFeatures key="features" title="Compassionate Care Services" features={[
        { title: "Palliative Specialists", description: "Doctors specialized in comfort care and symptom management" },
        { title: "Pain Management", description: "Expert control of pain and discomfort" },
        { title: "Emotional Support", description: "Counseling and emotional care for patients and families" },
        { title: "Spiritual Care", description: "Support respecting individual spiritual beliefs" },
        { title: "Family Guidance", description: "Education and support for family members" },
        { title: "Dignity & Comfort", description: "Ensuring comfort, dignity, and quality of life" },
      ]} />,
      <TransitionCare key="transition" />,
    ],
    processType: "end-of-life-care",
    faqType: "end-of-life-care",
  },
  "geriatric-care": {
    slug: "geriatric-care",
    title: "Geriatric Care",
    description: "Professional elderly care with doctors and trained caregivers specialized in seniors' healthcare.",
    components: [
      <ServiceHero key="hero" title="Geriatric Care" description="Specialized healthcare designed for the unique needs of seniors, combining medical expertise with compassionate support." />,
      <ServiceFeatures key="features" title="Senior Care Services" features={[
        { title: "Geriatric Specialists", description: "Doctors with expertise in elderly healthcare and age-related conditions" },
        { title: "Chronic Disease Management", description: "Professional management of diabetes, hypertension, arthritis, and other conditions" },
        { title: "Fall Prevention", description: "Safety assessments and preventive measures to avoid falls" },
        { title: "Medication Management", description: "Careful coordination of multiple medications" },
        { title: "Cognitive Support", description: "Care and support for memory and cognitive health" },
        { title: "Daily Living Assistance", description: "Help with activities of daily living and personal care" },
      ]} />,
      <TransitionCare key="transition" />,
    ],
    processType: "geriatric-care",
    faqType: "geriatric-care",
  },
  "chronic-wound-care": {
    slug: "chronic-wound-care",
    title: "Chronic Wound Care",
    description: "Expert chronic wound management and treatment at home with professional care.",
    components: [
      <ServiceHero key="hero" title="Chronic Wound Care" description="Professional wound management using advanced techniques to promote healing and prevent complications." />,
      <ServiceFeatures key="features" title="Wound Care Expertise" features={[
        { title: "Professional Assessment", description: "Detailed wound evaluation and healing potential assessment" },
        { title: "Advanced Dressings", description: "State-of-the-art wound care products and dressing techniques" },
        { title: "Infection Prevention", description: "Rigorous protocols to prevent wound infections" },
        { title: "Regular Monitoring", description: "Frequent assessments to track healing progress" },
        { title: "Specialized Treatments", description: "Advanced therapies like compression, debridement, and topical agents" },
        { title: "Patient Education", description: "Teaching proper home wound care and management" },
      ]} />,
      <TransitionCare key="transition" />,
    ],
    processType: "chronic-wound-care",
    faqType: "chronic-wound-care",
  },
  "home-medical-consultations": {
    slug: "home-medical-consultations",
    title: "Home Medical Consultations",
    description: "Convenient doctor consultations in the comfort of your home with professional medical advice.",
    components: [
      <ServiceHero key="hero" title="Home Medical Consultations" description="Professional medical advice without leaving your home. Convenient consultations for health concerns, preventive care, and ongoing management." />,
      <ServiceFeatures key="features" title="Consultation Services" features={[
        { title: "Doctor Visits at Home", description: "Licensed physicians available for home consultations" },
        { title: "Health Assessments", description: "Comprehensive physical examinations and health evaluations" },
        { title: "Prescription Services", description: "Medications prescribed and dispensed as needed" },
        { title: "Preventive Care", description: "Health screening and preventive medicine consultations" },
        { title: "Disease Management", description: "Ongoing care for chronic conditions" },
        { title: "Quick Response", description: "Fast scheduling for urgent health concerns" },
      ]} />,
      <TransitionCare key="transition" />,
    ],
    processType: "home-medical-consultations",
    faqType: "home-medical-consultations",
  },
  "routine-laboratory-services": {
    slug: "routine-laboratory-services",
    title: "Routine Laboratory Services",
    description: "Professional laboratory blood tests and diagnostic services conducted at home.",
    components: [
      <ServiceHero key="hero" title="Routine Laboratory Services" description="Professional laboratory services brought to your home. Blood tests, diagnostics, and health monitoring without hospital visits." />,
      <ServiceFeatures key="features" title="Laboratory Services" features={[
        { title: "Home Blood Tests", description: "Professional phlebotomists collect samples at your home" },
        { title: "Quick Results", description: "Fast turnaround for test results and reports" },
        { title: "Wide Range of Tests", description: "Comprehensive panels for health screening and monitoring" },
        { title: "Certified Laboratory", description: "Accredited labs ensure accuracy and reliability" },
        { title: "Results Interpretation", description: "Doctor consultation to explain test results" },
        { title: "Convenient Scheduling", description: "Flexible appointment times for your convenience" },
      ]} />,
      <TransitionCare key="transition" />,
    ],
    processType: "routine-laboratory-services",
    faqType: "routine-laboratory-services",
  },
  "physiotherapy-services": {
    slug: "physiotherapy-services",
    title: "Physiotherapy Services",
    description: "Professional physical therapy at home to restore mobility, strength, and independence.",
    components: [<PhysiotherapyHero key="hero" />, <PhysiotherapyFeatures key="features" />, <SessionTypes key="types" />],
    processType: "physiotherapy-services",
    faqType: "physiotherapy-services",
  },
  "postpartum-care": {
    slug: "postpartum-care",
    title: "Postpartum Care",
    description: "Comprehensive postpartum support for new mothers with professional guidance and care.",
    components: [
      <ServiceHero key="hero" title="Postpartum Care" description="Professional support for new mothers during the crucial postpartum period. Expert guidance for recovery, newborn care, and wellness." />,
      <ServiceFeatures key="features" title="Mother & Baby Support" features={[
        { title: "Recovery Monitoring", description: "Professional assessment of postpartum healing and recovery" },
        { title: "Lactation Support", description: "Expert guidance for breastfeeding and milk supply management" },
        { title: "Newborn Care", description: "Professional guidance on infant care, feeding, and development" },
        { title: "Mental Health", description: "Support for postpartum mood and emotional wellbeing" },
        { title: "Nutrition Guidance", description: "Specialized nutrition for recovery and energy" },
        { title: "Home Comfort", description: "Care provided in the comfort and privacy of your home" },
      ]} />,
      <TransitionCare key="transition" />,
    ],
    processType: "postpartum-care",
    faqType: "postpartum-care",
  },
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = serviceConfigs[slug]

  if (!service) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service not found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
        </div>
      </main>
    )
  }

  return <ServiceDetailContent service={service} />
}
