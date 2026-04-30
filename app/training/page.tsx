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
      <section className="relative py-24 px-4 lg:px-8 overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/10 to-slate-950 -z-10" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto max-w-6xl">
          {/* Top accent bar */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-1 bg-gradient-to-r from-primary/20 to-primary rounded-full" />
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Elevating Healthcare Standards</span>
              <div className="w-12 h-1 bg-gradient-to-l from-accent to-primary rounded-full" />
            </div>
          </div>

          {/* Main content */}
          <div className="text-center mb-12">
            <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-300 to-primary bg-clip-text text-transparent">
                Transform Healthcare
              </span>
              <br />
              <span className="text-3xl lg:text-4xl text-gray-300 font-light">
                Through Specialized Training
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Building the next generation of healthcare professionals equipped with world-class expertise and clinical precision
            </p>
          </div>

          {/* Content card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl hover:border-white/20 transition-all duration-500">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                Closing the Care Gap
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed text-base lg:text-lg">
                  Nigeria's healthcare system stands at a pivotal moment. While many professionals seek opportunities beyond our borders, those who remain are often constrained by outdated practices and insufficient training in specialized care delivery. The result? A skill gap that compromises patient outcomes and limits our nation's healthcare potential.
                </p>
                <p className="text-gray-300 leading-relaxed text-base lg:text-lg">
                  At LivingRite Care Academy, we're writing a different story. We invest in <span className="text-cyan-400 font-semibold">those who stay</span>, providing cutting-edge training programs that equip caregivers, nurses, and clinicians with the expertise to deliver world-class care right here at home.
                </p>
                
                {/* Key stats */}
                <div className="flex flex-col sm:flex-row gap-6 mt-8 pt-8 border-t border-white/10">
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-primary mb-1">5+</div>
                    <p className="text-sm text-gray-400">Specialized Programs</p>
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-primary mb-1">World-Class</div>
                    <p className="text-sm text-gray-400">Training Standards</p>
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-primary mb-1">100%</div>
                    <p className="text-sm text-gray-400">Practical Focus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Our 2026 Training Schedule
            </h2>
            <p className="text-xl text-gray-600">
              Choose from our expertly-designed programs and start your journey today
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Program List - Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-3">
                {programs.map((program) => (
                  <button
                    key={program.id}
                    onClick={() => setSelectedProgram(program.id)}
                    className={`w-full text-left p-5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      selectedProgram === program.id
                        ? `${program.lightColor} border-2 border-primary shadow-lg scale-105`
                        : "border-2 border-gray-200 hover:border-primary/50 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <h4 className="font-bold text-gray-900 text-base">{program.title}</h4>
                      <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {program.duration}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Program Details - Enhanced Card */}
            <div className="lg:col-span-2">
              {activeProgram ? (
                <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                  {/* Header with gradient */}
                  <div className={`h-2 bg-gradient-to-r ${activeProgram.color}`} />
                  
                  <div className="p-8 lg:p-10">
                    <h3 className="text-4xl font-bold text-gray-900 mb-2">
                      {activeProgram.title}
                    </h3>
                    <p className="text-gray-600 mb-8 font-medium">{activeProgram.focus}</p>

                    {/* Key Info Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-10 p-6 bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <Calendar className={`w-6 h-6 bg-gradient-to-br ${activeProgram.color} bg-clip-text text-transparent mx-auto mb-2`} />
                        <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Date</p>
                        <p className="font-bold text-gray-900 text-sm mt-1 leading-tight">
                          {activeProgram.date}
                        </p>
                      </div>
                      <div className="text-center border-l border-r border-gray-200">
                        <Clock className={`w-6 h-6 bg-gradient-to-br ${activeProgram.color} bg-clip-text text-transparent mx-auto mb-2`} />
                        <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Duration</p>
                        <p className="font-bold text-gray-900 text-sm mt-1">
                          {activeProgram.duration}
                        </p>
                      </div>
                      <div className="text-center">
                        <Award className={`w-6 h-6 bg-gradient-to-br ${activeProgram.color} bg-clip-text text-transparent mx-auto mb-2`} />
                        <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Level</p>
                        <p className="font-bold text-gray-900 text-sm mt-1">Professional</p>
                      </div>
                    </div>

                    {/* Program Description */}
                    <div className="mb-10">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className={`w-5 h-5 bg-gradient-to-br ${activeProgram.color} bg-clip-text text-transparent`} />
                        What You'll Learn
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-base">{activeProgram.description}</p>
                    </div>

                    {/* Target Audience */}
                    <div className="mb-10">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className={`w-5 h-5 bg-gradient-to-br ${activeProgram.color} bg-clip-text text-transparent`} />
                        Who Should Enroll
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeProgram.targetAudience.map((audience, idx) => (
                          <span
                            key={idx}
                            className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-br ${activeProgram.lightColor} text-gray-700 border border-primary/20`}
                          >
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Learning Outcomes */}
                    <div className="mb-10">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Check className={`w-5 h-5 bg-gradient-to-br ${activeProgram.color} bg-clip-text text-transparent`} />
                        Learning Outcomes
                      </h4>
                      <ul className="space-y-3">
                        {activeProgram.learningOutcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className={`w-5 h-5 bg-gradient-to-br ${activeProgram.color} bg-clip-text text-transparent mt-0.5 flex-shrink-0`} />
                            <span className="text-gray-700 text-base">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                       <Link href="https://nestuge.com/ivjxuy9om" target="_blank" className="flex-1">
                      <Button className={`flex-1 bg-gradient-to-r ${activeProgram.color} text-white rounded-full font-semibold py-3 hover:shadow-lg transition-all duration-300`}>
                        Enroll Now
                      </Button>
                      </Link>
                      <Link href="/support" className="flex-1">
                      <Button variant="outline" className="flex-1 border-2 border-gray-300 text-gray-900 rounded-full font-semibold py-3 hover:bg-gray-50 transition-all duration-300">
                        Request Info
                      </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
                  <div className="bg-gradient-to-br from-primary/10 to-cyan-600/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">
                    Select a program to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-24 px-4 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-600/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Why Our Training Academy Matters
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just providing training—we're building the foundation for healthcare excellence across Nigeria
            </p>
          </div>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Card className="relative p-10 bg-white border-2 border-gray-200 hover:border-blue-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-600" />
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 pt-1">
                    Combatting Brain Drain
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-base ml-18">
                  We invest in those who stay, ensuring that "home-based care" means world-class care and creating pathways for excellence at home.
                </p>
              </Card>
            </div>

            {/* Card 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Card className="relative p-10 bg-white border-2 border-gray-200 hover:border-red-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-600" />
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 pt-1">
                    Preventing Patient Harm
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-base ml-18">
                  We empower caregivers and clinicians with the confidence and skill to perform procedures safely and effectively.
                </p>
              </Card>
            </div>

            {/* Card 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Card className="relative p-10 bg-white border-2 border-gray-200 hover:border-purple-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 pt-1">
                    Building Specialized Manpower
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-base ml-18">
                  Training the specialists that the Nigerian healthcare landscape currently lacks, filling critical gaps in expertise.
                </p>
              </Card>
            </div>

            {/* Card 4 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Card className="relative p-10 bg-white border-2 border-gray-200 hover:border-teal-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 to-cyan-600" />
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 pt-1">
                    World-Class Standards
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-base ml-18">
                  Moving beyond theory into high-impact, practical mastery for real-world excellence and immediate application.
                </p>
              </Card>
            </div>
          </div>

          {/* Featured Quote Section */}
          <div className="relative mt-20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-600 rounded-3xl blur-2xl opacity-20" />
            <div className="relative bg-gradient-to-br from-primary via-primary to-cyan-600 rounded-3xl p-12 lg:p-16 shadow-2xl border border-white/10 overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10" />
              
              <div className="relative z-10 text-center">
                <p className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-relaxed">
                  "The rite path to full recovery starts with the rite training."
                </p>
                <div className="flex justify-center gap-2 mt-6">
                  <div className="w-8 h-1 bg-white/40 rounded-full" />
                  <div className="w-8 h-1 bg-white rounded-full" />
                  <div className="w-8 h-1 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>
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
            <Link href="https://nestuge.com/ivjxuy9om" target="_blank" className="flex-1">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-cyan-600 rounded-full font-semibold"
            >
              Enroll in a Program
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            </Link>
            <Link href="/support">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white"
            >
              Contact Us
            </Button>
            </Link>
          </div>

          <p className="text-gray-600 mt-8">
            For more information about enrollment, schedules, and fees, reach out to our academy team.
          </p>
        </div>
      </section>
    </main>

  );
}
