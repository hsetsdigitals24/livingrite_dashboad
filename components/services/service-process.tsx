"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface ServiceProcess {
  step: number
  title: string
  description: string
  details: string[]
}

const serviceProcesses: Record<string, ServiceProcess[]> = {
  "post-stroke-care": [
    {
      step: 1,
      title: "Comprehensive Assessment",
      description: "Initial evaluation of patient's condition",
      details: ["Medical history review", "Mobility assessment", "Cognitive evaluation", "Care plan development"],
    },
    {
      step: 2,
      title: "Personalized Care Plan",
      description: "Tailored recovery program",
      details: ["Physical therapy schedule", "Medication management", "Nutrition planning", "Progress milestones"],
    },
    {
      step: 3,
      title: "Ongoing Monitoring",
      description: "Continuous support and adjustment",
      details: ["Weekly progress assessments", "Therapy sessions", "Family updates", "Plan modifications"],
    },
    {
      step: 4,
      title: "Recovery & Independence",
      description: "Transition to sustainable recovery",
      details: ["Maintenance programs", "Home adaptations", "Support resources", "Follow-up care"],
    },
  ],
  "post-icu-care": [
    {
      step: 1,
      title: "Hospital Coordination",
      description: "Seamless transition planning",
      details: ["Hospital discharge coordination", "Medical records review", "Equipment setup", "Team introduction"],
    },
    {
      step: 2,
      title: "Intensive Home Setup",
      description: "Preparation for home care",
      details: ["Medical equipment installation", "24/7 monitoring setup", "Emergency protocols", "Family training"],
    },
    {
      step: 3,
      title: "24/7 Care Delivery",
      description: "Round-the-clock professional support",
      details: ["Continuous vital monitoring", "Medication administration", "Wound care", "Nutritional support"],
    },
    {
      step: 4,
      title: "Gradual Independence",
      description: "Building patient strength",
      details: ["Therapy progression", "Self-care training", "Mobility enhancement", "Care reduction"],
    },
  ],
  "physiotherapy-sessions": [
    {
      step: 1,
      title: "Initial Assessment",
      description: "Physical evaluation and goal setting",
      details: ["Range of motion testing", "Strength assessment", "Pain evaluation", "Goals discussion"],
    },
    {
      step: 2,
      title: "Program Design",
      description: "Customized therapy program",
      details: ["Exercise plan creation", "Equipment needs", "Frequency determination", "Home routine"],
    },
    {
      step: 3,
      title: "Regular Sessions",
      description: "Consistent therapy and support",
      details: ["In-home sessions", "Progressive exercises", "Technique correction", "Motivation support"],
    },
    {
      step: 4,
      title: "Achievement & Maintenance",
      description: "Reaching goals and sustaining gains",
      details: ["Goal milestone celebration", "Independence verification", "Maintenance plan", "Discharge support"],
    },
  ],
  "end-of-life-care": [
    {
      step: 1,
      title: "Compassionate Planning",
      description: "Goals and preferences discussion",
      details: ["Care preference assessment", "Family meetings", "Comfort goals", "Support planning"],
    },
    {
      step: 2,
      title: "Comfort Care Setup",
      description: "Creating a peaceful environment",
      details: ["Symptom management", "Pain control", "Emotional support", "Family counseling"],
    },
    {
      step: 3,
      title: "Supportive Care",
      description: "Presence and professional care",
      details: ["24/7 monitoring", "Symptom relief", "Spiritual support", "Family presence"],
    },
    {
      step: 4,
      title: "Bereavement Support",
      description: "Care for the grieving family",
      details: ["Grief counseling", "Memorial support", "Resource provision", "Follow-up care"],
    },
  ],
}

export function ServiceProcess({ serviceType }: { serviceType: string }) {
  const process = serviceProcesses[serviceType]

  if (!process) return null

  return (
    <section className="py-20 lg:py-28 bg-slate-900/70 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-slide-up">
            Our Care Process
          </h2>
          <p className="text-lg text-gray-300 animate-slide-up animation-delay-200">
            A structured approach to delivering exceptional care at every stage of your recovery journey.
          </p>
        </div>

        {/* Process Timeline */}
        <div className="max-w-4xl mx-auto">
          {process.map((stage, index) => (
            <div key={index} className="mb-8 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex gap-6">
                {/* Step Indicator */}
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white font-bold text-lg mb-4 shrink-0">
                    {stage.step}
                  </div>
                  {index < process.length - 1 && (
                    <div className="w-1 h-24 bg-linear-to-b from-primary/50 to-transparent"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <Card className="border-gray-700/50 bg-gray-900/70 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary/80 transition-colors">
                        {stage.title}
                      </h3>
                      <p className="text-gray-400 mb-4">{stage.description}</p>

                      {/* Details List */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {stage.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                            <span className="text-sm text-gray-300">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
