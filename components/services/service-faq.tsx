"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ServiceFAQItem {
  question: string;
  answer: string;
}

const faqData: Record<string, ServiceFAQItem[]> = {
  "post-stroke-care": [
    {
      question: "How soon after stroke should care begin?",
      answer:
        "Recovery is most effective when started within the first 3-6 months post-stroke. However, our programs can be beneficial at any stage. We'll assess your specific condition and create a personalized recovery plan.",
    },
    {
      question: "What qualifications do your stroke care nurses have?",
      answer:
        "All our stroke care nurses are registered healthcare professionals with specialized training in stroke rehabilitation, physical therapy, and patient mobility. They maintain current certifications and receive ongoing professional development.",
    },
    {
      question: "Can physiotherapy be done at home?",
      answer:
        "Yes! In-home physiotherapy is one of our specialties. Our therapists bring equipment and conduct personalized sessions in the comfort of your home, making recovery more convenient and often more effective.",
    },
    {
      question: "How often should therapy sessions occur?",
      answer:
        "The frequency depends on individual needs and recovery goals. Typically, we recommend 2-3 sessions per week, but this can be adjusted based on progress and medical advice.",
    },
    {
      question: "Is stroke care covered by insurance?",
      answer:
        "Many insurance plans cover post-stroke care services. We work with various insurance providers and can help you understand your coverage. Our team can assist with claims and documentation.",
    },
  ],
  "post-icu-care": [
    {
      question: "What equipment is needed for home-based ICU-level care?",
      answer:
        "Depending on the patient's condition, we may need oxygen equipment, cardiac monitors, feeding tubes, or other medical devices. During the initial consultation, we'll assess needs and arrange everything required.",
    },
    {
      question: "How is continuous monitoring provided at home?",
      answer:
        "We use advanced monitoring devices that track vital signs and alert our team to any changes. Your assigned care provider also performs regular checks and maintains detailed records of all observations.",
    },
    {
      question: "Can family members learn how to help?",
      answer:
        "Absolutely! We provide comprehensive training to family members on basic care procedures, emergency protocols, and how to support the patient's recovery. This involvement is encouraged and beneficial.",
    },
    {
      question: "What happens if there's an emergency?",
      answer:
        "We maintain 24/7 contact with all our patients. Our team is trained in emergency response and can quickly contact emergency services if needed. We also have protocols in place for rapid escalation.",
    },
    {
      question: "How long does post-ICU care typically last?",
      answer:
        "Duration varies greatly depending on the patient's condition and recovery speed. Some patients need intensive care for weeks or months, while others transition to reduced care levels as they improve.",
    },
  ],
  "physiotherapy-sessions": [
    {
      question: "Do I need a doctor's referral for physiotherapy?",
      answer:
        "While a referral is often helpful for insurance purposes, it's not always required to start physiotherapy. We can conduct an initial assessment and work with your healthcare provider to coordinate care.",
    },
    {
      question: "How long does each physiotherapy session take?",
      answer:
        "Typical sessions last 45-60 minutes, including assessment, targeted exercises, and progress discussion. The duration can be adjusted based on individual needs and energy levels.",
    },
    {
      question: "Will I have the same therapist for all sessions?",
      answer:
        "We try to provide continuity of care with the same therapist whenever possible, as this builds trust and allows for better progress tracking. In case of unavailability, you'll be matched with an equally qualified professional.",
    },
    {
      question: "What results can I expect from physiotherapy?",
      answer:
        "Results vary based on individual conditions, but many patients experience improved mobility, reduced pain, increased strength, and better independence in daily activities. We'll set realistic goals and track progress regularly.",
    },
    {
      question: "Can I continue exercises at home between sessions?",
      answer:
        "Yes! We provide detailed exercise guides and personalized home routines. Regular practice between sessions significantly accelerates recovery and helps maintain progress.",
    },
  ],
  "end-of-life-care": [
    {
      question: "Is end-of-life care the same as hospice?",
      answer:
        "Our palliative care focuses on comfort and quality of life and can be provided alongside curative treatments. Hospice typically begins when curative treatments are stopped. We specialize in compassionate end-of-life support.",
    },
    {
      question: "How do you manage pain and discomfort?",
      answer:
        "We use a comprehensive approach including medications, comfort measures, gentle positioning, and emotional support. Our team is trained in symptom management and works with physicians to optimize comfort.",
    },
    {
      question: "Can family members be present during care?",
      answer:
        "We encourage family presence and involvement. Visiting is always welcome, and we support meaningful time together. We also provide private spaces for family discussions and spiritual practices.",
    },
    {
      question: "What support is available for family members?",
      answer:
        "We provide counseling, grief support groups, educational resources, and spiritual guidance. Our support extends through and after the patient's passing, including bereavement follow-up.",
    },
    {
      question: "How do we discuss end-of-life preferences?",
      answer:
        "We facilitate thoughtful conversations about goals, preferences, and values. These discussions help us provide care that aligns with your wishes and loved one's dignity and comfort.",
    },
  ],
  "live-in-nursing": [
    {
      question: "Can I request specific caregivers or preferences?",
      answer:
        "Yes! We take personal preferences into account. We'll discuss your needs, values, and any specific requirements to match you with the most suitable caregiver for your household.",
    },
    {
      question: "What's included in live-in nursing care?",
      answer:
        "Live-in nursing includes 24/7 professional medical care, medication management, personal hygiene assistance, meal preparation, household support, and immediate response to any health concerns.",
    },
    {
      question: "How are days off and breaks handled?",
      answer:
        "We arrange backup coverage for any time off. A qualified substitute will be provided to ensure continuous care without interruption. This is planned in advance with your approval.",
    },
    {
      question: "Is live-in care appropriate for my condition?",
      answer:
        "Live-in nursing is suitable for various conditions requiring 24/7 medical supervision or assistance. We assess your specific needs and can advise whether this level of care is appropriate.",
    },
    {
      question: "What if the living situation doesn't work out?",
      answer:
        "We maintain open communication and address concerns immediately. If adjustments are needed, we'll work to resolve issues or, if necessary, arrange alternative caregiving arrangements.",
    },
  ],
  "rehabilitation-support": [
    {
      question: "When can rehabilitation begin after surgery?",
      answer:
        "Most post-surgical rehabilitation begins within 1-2 weeks of surgery, once initial healing has started. We'll coordinate with your surgeon to ensure proper timing and safely progress your recovery.",
    },
    {
      question: "How is rehabilitation progress measured?",
      answer:
        "We track progress through regular assessments of strength, mobility, pain levels, and functional abilities. Patients can see tangible improvements in their daily activities and independence.",
    },
    {
      question: "What if I experience pain during rehabilitation?",
      answer:
        "Some discomfort is normal, but pain shouldn't be severe. We adjust exercises, timing, and intensity based on your feedback. We also work with physicians to optimize pain management.",
    },
    {
      question: "How long does rehabilitation typically take?",
      answer:
        "Recovery timelines vary based on the type of injury or surgery, age, and overall health. We provide realistic timelines and celebrate milestones along the way. Most programs last 4-12 weeks.",
    },
    {
      question: "Can I return to sports or strenuous activities?",
      answer:
        "Many patients successfully return to their desired activities. We'll create a progressive plan to safely rebuild strength and confidence. Your goals guide our rehabilitation strategy.",
    },
  ],
  "corporate-wellness": [
    {
      question: "What wellness programs can you offer our organization?",
      answer:
        "We offer customized programs including health screenings, fitness consultations, stress management workshops, nutrition guidance, and preventive health education tailored to your workforce.",
    },
    {
      question: "How do we measure program effectiveness?",
      answer:
        "We track metrics like employee participation rates, health improvements, reduced absenteeism, and employee satisfaction surveys. We provide detailed reports to demonstrate ROI.",
    },
    {
      question: "Can programs be adapted for remote employees?",
      answer:
        "Absolutely! We offer virtual consultations, online wellness workshops, digital health resources, and remote health screenings to engage your entire workforce regardless of location.",
    },
    {
      question: "What's the typical cost for corporate wellness?",
      answer:
        "Pricing depends on company size, program scope, and duration. We provide customized quotes after understanding your specific needs and goals. Most programs offer excellent ROI.",
    },
    {
      question: "Do you provide ongoing support and adjustments?",
      answer:
        "Yes! We regularly review program effectiveness and make adjustments based on feedback and results. We're committed to continuous improvement and employee wellness outcomes.",
    },
  ],
  "family-support": [
    {
      question: "What types of respite care do you offer?",
      answer:
        "We provide temporary care coverage ranging from a few hours to extended periods, allowing primary caregivers to rest, run errands, or attend personal appointments while ensuring professional care continuity.",
    },
    {
      question: "How can I access counseling services?",
      answer:
        "Our counseling services are available to all family caregivers. You can schedule appointments directly, and we offer both individual and group sessions to address various caregiver challenges.",
    },
    {
      question: "What support is available for caregiver burnout?",
      answer:
        "We recognize caregiver burnout as serious. We offer stress management resources, peer support groups, respite care, professional counseling, and practical coping strategies.",
    },
    {
      question: "Is there a cost for family support services?",
      answer:
        "Many services are included with our patient care packages. Additional counseling or support services may have separate fees, which we discuss transparently during consultation.",
    },
    {
      question: "Can family members attend care training sessions?",
      answer:
        "Yes! We encourage family involvement and provide training on care procedures, emergency response, and techniques to help loved ones while supporting your own wellbeing.",
    },
  ],
};

export function ServiceFAQ({ serviceType }: { serviceType: string }) {
  const faqs = faqData[serviceType];

  if (!faqs) return null;

  return (
    <section className="py-20 lg:py-28 bg-slate-900 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-slide-up">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-300 animate-slide-up animation-delay-200">
            Find answers to common questions about our services and how we can
            help you.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <summary className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-700/50 bg-linear-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm px-6 py-4 text-lg font-semibold text-white hover:border-primary/50 transition-all duration-300 group-open:border-primary/50 group-open:bg-linear-to-br group-open:from-gray-700/40 group-open:to-gray-800/40">
                <span>{faq.question}</span>
                <ArrowRight className="ml-4 h-5 w-5 transition-transform duration-300 group-open:rotate-90" />
              </summary>
              <div className="overflow-hidden border border-t-0 border-gray-700/50 bg-linear-to-br from-gray-900/40 to-gray-900/60 backdrop-blur-sm px-6 py-4 text-gray-300 rounded-b-lg animate-slide-up">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 text-center animate-slide-up animation-delay-500">
          <Card className="border-gray-700/50 bg-white backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-700 mb-6">
                Our care specialists are ready to discuss your specific needs
                and provide personalized guidance.
              </p>
              <Link
                target="_blank"
                href="https://calendly.com/clientservices-livingritecare/30min"
                className="flex items-center w-fit mx-auto"
              >
                <Button className="cursor-pointer bg-accent hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 group">
                  Schedule a Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
