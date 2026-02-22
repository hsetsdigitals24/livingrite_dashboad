"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronDown, Search, Share2, FileText, Lightbulb, Clock, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

// FAQ Schema for SEO
const generateFaqSchema = (categories: FaqCategory[]) => {
  const faqData = categories.flatMap((category) =>
    category.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    }))
  )

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData,
  }
}

// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LivingRite Care",
  "url": "https://livingritecare.com",
  "description": "Professional home healthcare services in Nigeria",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+234-703-593-2851",
    "contactType": "Customer Service",
    "email": "livingritecare@gmail.com",
  },
}

interface FaqItem {
  q: string
  a: string
  keywords?: string[]
}

interface FaqCategory {
  name: string
  icon: string
  color: string
  description: string
  faqs: FaqItem[]
}

const faqCategories: FaqCategory[] = [
  {
    name: "Booking and First Steps",
    icon: "📅",
    color: "from-blue-50 to-cyan-50",
    description: "Learn how to start your care journey with LivingRite Care",
    faqs: [
      {
        q: "How do I book a consultation with Livingrite Care?",
        a: "You can book a free 30-minute consultation from our website through this link. You can also contact us on WhatsApp at +234 703 593 2851 or +234 810 683 4519.",
        keywords: ["booking", "consultation", "contact", "free"],
      },
      {
        q: "Is the first consultation free?",
        a: "Yes. Our initial 30-minute consultation is free. During that time a doctor or a qualified nurse will assess your loved one's needs and explain how we can provide care for them.",
        keywords: ["free", "consultation", "assessment", "no charge"],
      },
      {
        q: "How long after the consultation will care start?",
        a: "Care usually begins once the care plan is approved and payment and logistics are finalized. We aim to start as soon as availability and logistics are settled between us and you.",
        keywords: ["timeline", "start date", "logistics", "approval"],
      },
    ],
  },
  {
    name: "Services and Care Plans",
    icon: "🏥",
    color: "from-emerald-50 to-teal-50",
    description: "Discover our comprehensive care services and personalized care plans",
    faqs: [
      {
        q: "What services does Livingrite Care offer?",
        a: "We offer neurorehabilitation, post-ICU recovery, post-surgical care, palliative and end-of-life care, geriatric care, and chronic wound management. Some of our additional services include home medical consultations, physiotherapy, routine laboratory services, and postpartum care.",
        keywords: ["services", "care types", "rehabilitation", "specialties"],
      },
      {
        q: "What does \"doctor-led\" care mean?",
        a: "Doctor-led care means our clinical protocols are designed and supervised by well-trained and experienced medical doctors, including neurocritical care specialists. A doctor provides clinical oversight, plans care, and is available for escalation when needed.",
        keywords: ["doctor-led", "medical supervision", "clinical oversight", "physicians"],
      },
      {
        q: "What are your home care tier plans?",
        a: "We offer tailored tiers to match medical need and intensity. For neurorehabilitation we have Platinum, Diamond, and Gold tiers with each tier having different mixes of care providers assigned to your loved one.",
        keywords: ["tiers", "plans", "options", "levels", "pricing"],
      },
      {
        q: "Do you provide 24-hour live-in care?",
        a: "Yes. We offer 24-hour live-in care options for patients who need continuous supervision and support.",
        keywords: ["24-hour", "live-in", "continuous care", "overnight"],
      },
      {
        q: "How is a care plan created and approved?",
        a: "After the free consultation, the clinician who assessed the patient drafts a personalized care plan. We send this plan to the family for review. Once the family approves and the payment and logistics are finalized, we implement the plan.",
        keywords: ["care plan", "personalized", "approval process", "implementation"],
      },
    ],
  },
  {
    name: "Costs, Payments, and Policies",
    icon: "💳",
    color: "from-amber-50 to-orange-50",
    description: "Understand our transparent pricing and flexible payment options",
    faqs: [
      {
        q: "How much do your services cost?",
        a: "Costs depend on the service type, care tier, duration, and clinical needs you or your loved one might require. We provide a detailed cost estimate after the consultation and planning stage. For pricing details, please contact our team.",
        keywords: ["cost", "price", "rates", "charges", "fees"],
      },
      {
        q: "Which payment methods do you accept?",
        a: "We accept different payment methods. Please contact us via email livingritecare@gmail.com or via whatsapp to discuss your payment method.",
        keywords: ["payment", "methods", "bank transfer", "payment plans"],
      },
      {
        q: "What is your refund and cancellation policy?",
        a: "We have a transparent refund and cancellation policy. Requests should be made within ten working days and will be processed in line with our terms and conditions.",
        keywords: ["refund", "cancellation", "policy", "terms"],
      },
    ],
  },
  {
    name: "Clinical Safety and Emergency Handling",
    icon: "🚑",
    color: "from-red-50 to-rose-50",
    description: "Safety protocols and emergency procedures for patient care",
    faqs: [
      {
        q: "What happens if my loved one's condition suddenly worsens at home?",
        a: "Caregivers are trained to provide immediate first-response care to stabilize the patient. The situation is quickly escalated to a supervising doctor. If needed, the doctor will attend in person or arrange a hospital transfer. We ensure that families are carried along every step of the way.",
        keywords: ["emergency", "worsening condition", "escalation", "response"],
      },
      {
        q: "Do you refer patients back to the hospital when needed?",
        a: "If needed, Yes we do. We evaluate each situation and refer to hospital care when higher-level intervention is needed. We support the family through the transfer to ensure continuity of care.",
        keywords: ["hospital transfer", "referral", "escalation", "continuity"],
      },
      {
        q: "What clinical qualifications do your staff have?",
        a: "Our teams include medical doctors, neurocritical care specialists, registered nurses, physiotherapists, speech therapists, nutritionists, and trained nursing assistants. So be rest assured that your loved ones are in the safest hands.",
        keywords: ["qualifications", "credentials", "training", "specialists", "doctors"],
      },
    ],
  },
  {
    name: "Client Portal and Communication",
    icon: "💬",
    color: "from-purple-50 to-pink-50",
    description: "Stay informed with our communication tools and client portal",
    faqs: [
      {
        q: "What information will I get through the client portal?",
        a: "Families receive daily care logs that include a summary of pathology, care given, current vital signs, medications and refill alerts, food and fluid intake, and any new complaints. Weekly reports include visual graphs tracking vital sign trends and recovery progress.",
        keywords: ["portal", "logs", "updates", "information", "reporting"],
      },
      {
        q: "How do families communicate with the care team?",
        a: "Families can communicate via the client portal, WhatsApp, SMS, or email. We also provide an admin contact number for daily updates or urgent questions.",
        keywords: ["communication", "contact", "updates", "messaging", "portal"],
      },
    ],
  },
  {
    name: "Recovery Expectations",
    icon: "📈",
    color: "from-green-50 to-emerald-50",
    description: "Realistic recovery timelines and measurable health goals",
    faqs: [
      {
        q: "How long will it take to see improvement?",
        a: "Recovery timelines vary by condition, severity, and individual response to therapy. Your clinician will set realistic milestones in the care plan and monitor progress. We focus on measurable, humane goals and share progress with your family regularly.",
        keywords: ["recovery", "timeline", "progress", "improvement", "goals"],
      },
      {
        q: "Can Livingrite Care support stroke recovery at home?",
        a: "Yes. We provide specialized neurorehabilitation for stroke recovery. Our programs combine medical oversight with physiotherapy, speech therapy, nutrition support, and caregiver training.",
        keywords: ["stroke recovery", "rehabilitation", "neurorehabilitation", "therapy"],
      },
      {
        q: "Can you provide end-of-life care at home?",
        a: "Yes. We offer compassionate palliative care and end-of-life support focused on pain control, comfort, dignity, and family support.",
        keywords: ["end-of-life", "palliative care", "hospice", "comfort care"],
      },
    ],
  },
  {
    name: "Corporate and Community",
    icon: "🤝",
    color: "from-indigo-50 to-blue-50",
    description: "Community programs and corporate partnerships",
    faqs: [
      {
        q: "Do you provide corporate wellness or employer packages?",
        a: "We are developing corporate care packages for 2026 that will include routine screening and health packages. Please contact us for planning and partnership discussions.",
        keywords: ["corporate", "wellness", "employer", "packages", "partnerships"],
      },
      {
        q: "What is Living Well with Livingrite Care?",
        a: "This is our email and WhatsApp community. It shares practical health tips, myth-busting information, caregiver support, and preventive care advice. It is a safe space for families and caregivers to learn and ask questions.",
        keywords: ["community", "wellness", "tips", "education", "support"],
      },
    ],
  },
  {
    name: "Location and Coverage",
    icon: "📍",
    color: "from-cyan-50 to-blue-50",
    description: "Our service areas and coverage across Nigeria",
    faqs: [
      {
        q: "Where do you operate?",
        a: "Our primary operations are in Lagos, Nigeria. We deliver services across Lagos and can support clients in nearby regions. For locations outside Lagos please contact us to discuss feasibility.",
        keywords: ["location", "coverage", "service area", "Lagos"],
      },
      {
        q: "How do I know if you can come to my area?",
        a: "Contact us with your full address and we will confirm availability and logistics.",
        keywords: ["availability", "service area", "location", "coverage"],
      },
    ],
  },
]

// FAQ Accordion Item Component
function FaqAccordionItem({
  q,
  a,
  index,
  isOpen,
  onToggle,
  onShare,
}: {
  q: string
  a: string
  index: number
  isOpen: boolean
  onToggle: () => void
  onShare: (q: string, a: string) => void
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all duration-200 hover:shadow-md">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className="text-left font-semibold text-gray-900 text-base md:text-lg">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          id={`faq-answer-${index}`}
          className="px-6 py-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200"
        >
          <p className="text-gray-700 leading-relaxed text-base mb-4">{a}</p>
          <button
            onClick={() => onShare(q, a)}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
            title="Share this Q&A"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      )}
    </div>
  )
}

// Stats Section Component
function StatsSection() {
  const totalFaqs = faqCategories.reduce((sum, cat) => sum + cat.faqs.length, 0)
  const totalCategories = faqCategories.length

  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-y border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{totalFaqs}+</div>
              <div className="text-xs md:text-sm text-gray-600">Questions Answered</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{totalCategories}</div>
              <div className="text-xs md:text-sm text-gray-600">Topics Covered</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-xs md:text-sm text-gray-600">Support Ready</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">500+</div>
              <div className="text-xs md:text-sm text-gray-600">Families Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Search and Filter Component
function SearchAndFilter({
  searchTerm,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: {
  searchTerm: string
  onSearchChange: (term: string) => void
  activeCategory: string | null
  onCategoryChange: (category: string | null) => void
}) {
  return (
    <section className="sticky top-20 z-40 bg-white border-b border-gray-200 py-4 md:py-6 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs by keyword..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            aria-label="Search FAQs"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
              activeCategory === null
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Categories
          </button>
          {faqCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategoryChange(category.name)}
              className={`px-4 py-2 rounded-full font-medium transition-all text-sm whitespace-nowrap ${
                activeCategory === category.name
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Between Categories
function CategoryCta() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-xl text-center my-12">
      <h3 className="text-2xl font-bold mb-3">Didn't find your answer?</h3>
      <p className="mb-6 text-blue-50">Our team is here to help. Get in touch for personalized support.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="https://wa.me/+2347035932851"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          WhatsApp Us
        </a>
        <a
          href="mailto:livingritecare@gmail.com"
          className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
        >
          Send Email
        </a>
      </div>
    </div>
  )
}

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [openFaqs, setOpenFaqs] = useState<Set<string>>(new Set())

  // Inject schema markup for SEO
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify(generateFaqSchema(faqCategories))
    document.head.appendChild(script)

    const orgScript = document.createElement("script")
    orgScript.type = "application/ld+json"
    orgScript.innerHTML = JSON.stringify(organizationSchema)
    document.head.appendChild(orgScript)

    return () => {
      document.head.removeChild(script)
      document.head.removeChild(orgScript)
    }
  }, [])

  // Filter FAQs based on search and category
  const filteredCategories = useMemo(() => {
    return faqCategories
      .filter((cat) => !activeCategory || cat.name === activeCategory)
      .map((cat) => {
        const filteredFaqs = cat.faqs.filter(
          (faq) =>
            searchTerm === "" ||
            faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (faq.keywords || []).some((kw) => kw.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        return {
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          description: cat.description,
          faqs: filteredFaqs,
        }
      })
      .filter((cat) => cat.faqs.length > 0)
  }, [searchTerm, activeCategory])

  const handleToggleFaq = (faqId: string) => {
    const newOpen = new Set(openFaqs)
    if (newOpen.has(faqId)) {
      newOpen.delete(faqId)
    } else {
      newOpen.add(faqId)
    }
    setOpenFaqs(newOpen)
  }

  const handleShareFaq = (q: string, a: string) => {
    const text = `Q: ${q}\n\nA: ${a}\n\n${typeof window !== "undefined" ? window.location.href : ""}`
    if (navigator.share) {
      navigator.share({ title: "LivingRite Care FAQ", text })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text)
      alert("FAQ copied to clipboard!")
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            ✓ Answers You Need
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Find comprehensive answers about our services, care plans, safety protocols, communications, and support.
            Everything you need to know about LivingRite Care in one place.
          </p>

          {/* Quick CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href="#consultation" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block">
              Schedule Free Consultation
            </a>
            <button className="border border-blue-200 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Print Guide
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Search and Filter */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Main FAQ Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or clearing the filters to see more questions.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setActiveCategory(null)
                }}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredCategories.map((category, catIdx) => (
                <div key={category.name} id={`faq-${category.name}`}>
                  {/* Category Header */}
                  <div
                    className={`bg-gradient-to-r ${category.color} rounded-xl p-6 md:p-8 mb-8 border border-gray-200`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl md:text-5xl flex-shrink-0">{category.icon}</span>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{category.name}</h2>
                        <p className="text-gray-700">{category.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* FAQs List */}
                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIdx) => {
                      const faqId = `${catIdx}-${faqIdx}`
                      const isOpen = openFaqs.has(faqId)

                      return (
                        <FaqAccordionItem
                          key={faqId}
                          q={faq.q}
                          a={faq.a}
                          index={faqIdx}
                          isOpen={isOpen}
                          onToggle={() => handleToggleFaq(faqId)}
                          onShare={handleShareFaq}
                        />
                      )
                    })}
                  </div>

                  {/* CTA after each category except last */}
                  {catIdx < filteredCategories.length - 1 && <CategoryCta />}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:border-white/40 transition">
              <h3 className="font-bold text-lg text-white mb-2">Still have questions?</h3>
              <p className="text-sm text-blue-50 mb-4">Our team is ready to help with any additional questions or concerns.</p>
              <a
                href="https://wa.me/+2347035932851"
                className="inline-block text-sm bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                Contact via WhatsApp
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:border-white/40 transition">
              <h3 className="font-bold text-lg text-white mb-2">Email us</h3>
              <p className="text-sm text-blue-50 mb-4">Get detailed information tailored to your specific needs.</p>
              <a
                href="mailto:livingritecare@gmail.com"
                className="inline-block text-sm bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                Send an Email
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:border-white/40 transition">
              <h3 className="font-bold text-lg text-white mb-2">Book a consultation</h3>
              <p className="text-sm text-blue-50 mb-4">Get a free 30-minute assessment from our qualified experts.</p>
              <button className="inline-block text-sm bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
