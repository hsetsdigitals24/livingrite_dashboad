"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight, Calendar, Clock, Users, Target, Zap, Award } from "lucide-react";
import { useState } from "react";

interface TrainingProgram {
  id: string;
  title: string;
  date: string;
  duration: string;
  focus: string;
  description: string;
  targetAudience: string[];
  learningOutcomes: string[];
  color: string;
  lightColor: string;
}

const programs: TrainingProgram[] = [
  {
    id: "1",
    title: "Phlebotomy Training",
    date: "22nd – 26th February 2026",
    duration: "5 days",
    focus: "Clinical blood collection techniques",
    description: "Master the art and science of clinical blood collection with hands-on training in proper venipuncture, capillary collection, and specimen handling.",
    targetAudience: ["Clinical Laboratory Technicians", "Nurses", "Healthcare Practitioners"],
    learningOutcomes: [
      "Proper venipuncture techniques",
      "Capillary collection methods",
      "Specimen handling and storage",
      "Patient safety and communication",
      "Standard precautions compliance"
    ],
    color: "from-blue-600 to-blue-700",
    lightColor: "bg-blue-50 border-blue-200",
  },
  {
    id: "2",
    title: "BLS Training for First Responders & Caregivers",
    date: "14th & 15th March 2026",
    duration: "2 days",
    focus: "Essential Basic Life Support skills",
    description: "Learn life-saving Basic Life Support skills including CPR, rescue breathing, and emergency response protocols.",
    targetAudience: ["Caregivers", "First Responders", "Healthcare Workers", "Community Members"],
    learningOutcomes: [
      "Effective CPR techniques",
      "Rescue breathing procedures",
      "Choking management",
      "Emergency response protocols",
      "BLS Certification"
    ],
    color: "from-red-600 to-red-700",
    lightColor: "bg-red-50 border-red-200",
  },
  {
    id: "3",
    title: "Specialized Post-Stroke Care",
    date: "14th – 30th March 2026",
    duration: "17 days",
    focus: "Advanced stroke care and neuro-recovery",
    description: "Comprehensive training in post-stroke care management, rehabilitation techniques, and neuro-recovery protocols.",
    targetAudience: ["Caregivers", "Nurses", "Care Assistants", "Healthcare Providers"],
    learningOutcomes: [
      "Acute stroke assessment",
      "Recovery phase management",
      "Physical rehabilitation techniques",
      "Cognitive rehabilitation strategies",
      "Patient motivation and engagement"
    ],
    color: "from-purple-600 to-purple-700",
    lightColor: "bg-purple-50 border-purple-200",
  },
  {
    id: "4",
    title: "Critical Care Nursing",
    date: "1st – 15th April 2026",
    duration: "15 days",
    focus: "Managing critical recovery phases",
    description: "Advanced nursing training for managing patients in critical care settings and complex recovery phases.",
    targetAudience: ["Registered Nurses", "Nursing Officers", "Intensive Care Staff"],
    learningOutcomes: [
      "Critical patient assessment",
      "Hemodynamic monitoring",
      "Ventilator management basics",
      "Medication administration in critical care",
      "Emergency intervention protocols"
    ],
    color: "from-orange-600 to-orange-700",
    lightColor: "bg-orange-50 border-orange-200",
  },
  {
    id: "5",
    title: "Ultrasound-Guided Phlebotomy",
    date: "1st – 10th May 2026",
    duration: "10 days",
    focus: "Advanced vascular access techniques",
    description: "Advanced training for clinicians in ultrasound-guided vascular access and difficult venipuncture techniques.",
    targetAudience: ["Clinicians", "Nurses", "Laboratory Professionals", "Experienced Phlebotomists"],
    learningOutcomes: [
      "Ultrasound anatomy basics",
      "Probe handling techniques",
      "Vascular mapping",
      "Difficult access management",
      "Catheter insertion guidance"
    ],
    color: "from-teal-600 to-teal-700",
    lightColor: "bg-teal-50 border-teal-200",
  },
];

export default function TrainingPage() {
  const [selectedProgram, setSelectedProgram] = useState<string>("1");

  const activeProgram = programs.find(p => p.id === selectedProgram);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-r from-primary/5 to-cyan-600/5 border-b border-primary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
              Training & Academy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Building the specialized manpower Nigeria's healthcare system needs
            </p>
          </div>

          <div className="bg-white border border-primary/20 rounded-2xl p-8 lg:p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Closing the Care Gap: Building the Manpower Nigeria Needs
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nigeria's healthcare system is at a crossroads. As many professionals seek opportunities abroad, the dedicated nurses, clinicians, and caregivers who remain are often left without the advanced, specialized training required for complex out-of-hospital care. This skill gap doesn't just stall recovery—it can lead to preventable harm.
            </p>
            <p className="text-gray-700 leading-relaxed">
              At LivingRite Care, we are stepping in to bridge this gap. We are a capacity-building company dedicated to equipping the next generation of healthcare providers with the clinical precision and requisite skills needed to protect and restore the lives of our citizens.
            </p>
          </div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Our 2026 Training Schedule
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Program List */}
            <div className="lg:col-span-1 space-y-4">
              {programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => setSelectedProgram(program.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedProgram === program.id
                      ? program.lightColor + " border-primary shadow-lg"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <h4 className="font-bold text-gray-900">{program.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{program.duration}</p>
                </button>
              ))}
            </div>

            {/* Program Details */}
            <div className="lg:col-span-2">
              {activeProgram ? (
                <div className={`${activeProgram.lightColor} border-2 rounded-2xl p-8 lg:p-10`}>
                  <div className={`h-1 bg-gradient-to-r ${activeProgram.color} mb-6 rounded-full`} />
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    {activeProgram.title}
                  </h3>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4">
                      <Calendar className="w-6 h-6 text-primary mb-2" />
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {activeProgram.date}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <Clock className="w-6 h-6 text-primary mb-2" />
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {activeProgram.duration}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <Users className="w-6 h-6 text-primary mb-2" />
                      <p className="text-sm text-gray-600">Target</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        Pro
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Program Focus
                    </h4>
                    <p className="text-gray-700">{activeProgram.description}</p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Target Audience
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProgram.targetAudience.map((audience, idx) => (
                        <span
                          key={idx}
                          className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-primary/20"
                        >
                          {audience}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Learning Outcomes
                    </h4>
                    <ul className="space-y-3">
                      {activeProgram.learningOutcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1 bg-gradient-to-r from-primary to-cyan-600 rounded-full">
                      Enroll Now
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-full">
                      Request Info
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-primary/5 to-cyan-600/5 border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center">
                  <Zap className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                  <p className="text-gray-600 text-lg">
                    Select a program to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 px-4 lg:px-8 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Why Our Training Academy Matters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Combatting Brain Drain
              </h3>
              <p className="text-gray-700">
                We invest in those who stay, ensuring that "home-based care" means world-class care.
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Preventing Patient Harm
              </h3>
              <p className="text-gray-700">
                We empower caregivers and clinicians with the confidence and skill to perform procedures safely.
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Building Specialized Manpower
              </h3>
              <p className="text-gray-700">
                Training the specialists that the Nigerian healthcare landscape currently lacks.
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                World-Class Standards
              </h3>
              <p className="text-gray-700">
                Moving beyond theory into high-impact, practical mastery for real-world excellence.
              </p>
            </Card>
          </div>

          <div className="mt-16 bg-gradient-to-r from-primary to-cyan-600 rounded-2xl p-12 text-center text-white">
            <p className="text-2xl font-bold mb-2">
              "The rite path to full recovery starts with the rite training."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join healthcare professionals across Nigeria in elevating standards of care through our specialized training programs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-cyan-600 rounded-full font-semibold"
            >
              Enroll in a Program
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white"
            >
              Contact Us
            </Button>
          </div>

          <p className="text-gray-600 mt-8">
            For more information about enrollment, schedules, and fees, reach out to our academy team.
          </p>
        </div>
      </section>
    </main>
  );
}
