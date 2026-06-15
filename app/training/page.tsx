"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Check,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Target,
  Zap,
  Award,
  GraduationCap,
} from "lucide-react";
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
  },
];

// Brand palette — alternate cyan/magenta for per-item visual rhythm.
const BRAND_CYAN = "#00b2ec";
const BRAND_MAGENTA = "#e50d92";

export default function TrainingPage() {
  const [selectedProgram, setSelectedProgram] = useState<string>("1");

  const activeProgram = programs.find((p) => p.id === selectedProgram);
  const activeIndex = programs.findIndex((p) => p.id === selectedProgram);
  const activeAccent = activeIndex % 2 === 0 ? BRAND_CYAN : BRAND_MAGENTA;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-[#f5fbff] to-[#faf7ff]">
      {/* Hero Section */}
      <section className="relative py-24 px-4 lg:px-8 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 right-0 w-96 h-96 bg-gradient-to-br from-[#00b2ec]/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute -bottom-40 left-0 w-96 h-96 bg-gradient-to-tr from-[#e50d92]/15 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Badge */}
          <div className="flex items-center justify-center mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00b2ec]/15 to-[#e50d92]/10 border border-[#00b2ec]/40 text-[#0088b8] px-4 py-2.5 rounded-full text-sm font-semibold hover:border-[#00b2ec]/60 hover:shadow-lg hover:shadow-[#00b2ec]/20 transition-all duration-300">
              <GraduationCap className="h-4 w-4" />
              Elevating Healthcare Standards
            </div>
          </div>

          {/* Main content */}
          <div className="text-center mb-12 animate-slide-up animation-delay-200">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight text-gray-900">
              <span className="bg-gradient-to-r from-[#00b2ec] via-[#0088b8] to-[#e50d92] bg-clip-text text-transparent animate-gradient-shift">
                Transform Healthcare
              </span>
              <br />
              <span className="text-3xl lg:text-4xl text-gray-500 font-light">
                Through Specialized Training
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
              Building the next generation of healthcare professionals equipped with world-class expertise and clinical precision
            </p>
          </div>

          {/* Content card */}
          <div className="bg-white border border-[#00b2ec]/30 rounded-3xl p-8 lg:p-12 shadow-2xl shadow-[#00b2ec]/15 hover:shadow-3xl hover:shadow-[#00b2ec]/25 transition-all duration-500 animate-slide-up animation-delay-300">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Closing the Care Gap
              </h2>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-base lg:text-lg font-light">
                  Nigeria&apos;s healthcare system stands at a pivotal moment. While many professionals seek opportunities beyond our borders, those who remain are often constrained by outdated practices and insufficient training in specialized care delivery. The result? A skill gap that compromises patient outcomes and limits our nation&apos;s healthcare potential.
                </p>
                <p className="text-gray-700 leading-relaxed text-base lg:text-lg font-light">
                  At LivingRite Care Academy, we&apos;re writing a different story. We invest in <span className="text-[#00b2ec] font-semibold">those who stay</span>, providing cutting-edge training programs that equip caregivers, nurses, and clinicians with the expertise to deliver <span className="text-[#e50d92] font-semibold">world-class care</span> right here at home.
                </p>

                {/* Key stats */}
                <div className="flex flex-col sm:flex-row gap-6 mt-8 pt-8 border-t border-gray-200">
                  <div className="flex-1">
                    <div className="text-3xl font-black text-[#00b2ec] mb-1">5+</div>
                    <p className="text-sm text-gray-500">Specialized Programs</p>
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-black text-[#e50d92] mb-1">World-Class</div>
                    <p className="text-sm text-gray-500">Training Standards</p>
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-black text-[#0088b8] mb-1">100%</div>
                    <p className="text-sm text-gray-500">Practical Focus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Our 2026{" "}
              <span className="bg-gradient-to-r from-[#00b2ec] to-[#e50d92] bg-clip-text text-transparent">
                Training Schedule
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Choose from our expertly-designed programs and start your journey today
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Program List - Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-3">
                {programs.map((program, idx) => {
                  const isActive = selectedProgram === program.id;
                  const accent = idx % 2 === 0 ? BRAND_CYAN : BRAND_MAGENTA;
                  return (
                    <button
                      key={program.id}
                      onClick={() => setSelectedProgram(program.id)}
                      className={`w-full text-left p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-[#00b2ec]/10 to-[#e50d92]/5 border-2 shadow-lg shadow-[#00b2ec]/15"
                          : "border-2 border-gray-200 hover:border-[#00b2ec]/50 bg-white hover:shadow-md"
                      }`}
                      style={isActive ? { borderColor: accent } : undefined}
                    >
                      <div className="relative z-10">
                        <h4 className="font-bold text-gray-900 text-base">{program.title}</h4>
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: accent }} />
                          {program.duration}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Program Details */}
            <div className="lg:col-span-2">
              {activeProgram ? (
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl shadow-[#00b2ec]/10 hover:shadow-2xl hover:shadow-[#00b2ec]/20 transition-all duration-300">
                  {/* Header accent */}
                  <div className="h-2 bg-gradient-to-r from-[#00b2ec] to-[#e50d92]" />

                  <div className="p-8 lg:p-10">
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      {activeProgram.title}
                    </h3>
                    <p className="text-gray-500 mb-8 font-medium">{activeProgram.focus}</p>

                    {/* Key Info Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-10 p-6 bg-gradient-to-br from-[#f5fbff] to-[#faf7ff] rounded-2xl border border-[#00b2ec]/10">
                      <div className="text-center">
                        <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: BRAND_CYAN }} />
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Date</p>
                        <p className="font-bold text-gray-900 text-sm mt-1 leading-tight">
                          {activeProgram.date}
                        </p>
                      </div>
                      <div className="text-center border-l border-r border-gray-200">
                        <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: BRAND_MAGENTA }} />
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Duration</p>
                        <p className="font-bold text-gray-900 text-sm mt-1">
                          {activeProgram.duration}
                        </p>
                      </div>
                      <div className="text-center">
                        <Award className="w-6 h-6 mx-auto mb-2" style={{ color: "#0088b8" }} />
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Level</p>
                        <p className="font-bold text-gray-900 text-sm mt-1">Professional</p>
                      </div>
                    </div>

                    {/* Program Description */}
                    <div className="mb-10">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5" style={{ color: activeAccent }} />
                        What You&apos;ll Learn
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-base font-light">{activeProgram.description}</p>
                    </div>

                    {/* Target Audience */}
                    <div className="mb-10">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" style={{ color: activeAccent }} />
                        Who Should Enroll
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeProgram.targetAudience.map((audience, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-[#00b2ec]/10 text-[#0088b8] border border-[#00b2ec]/20"
                          >
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Learning Outcomes */}
                    <div className="mb-10">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5" style={{ color: activeAccent }} />
                        Learning Outcomes
                      </h4>
                      <ul className="space-y-3">
                        {activeProgram.learningOutcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#00b2ec]/10 flex items-center justify-center">
                              <Check className="w-3 h-3" style={{ color: BRAND_CYAN }} />
                            </span>
                            <span className="text-gray-700 text-base">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <Link href="https://nestuge.com/ivjxuy9om" target="_blank" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-[#00b2ec] to-[#0088b8] hover:from-[#0088b8] hover:to-[#00b2ec] text-white rounded-full font-semibold py-3 shadow-lg shadow-[#00b2ec]/30 hover:shadow-xl hover:shadow-[#00b2ec]/40 transition-all duration-300">
                          Enroll Now
                        </Button>
                      </Link>
                      <Link href="/support" className="flex-1">
                        <Button variant="outline" className="w-full border-2 border-[#00b2ec] text-[#00b2ec] rounded-full font-semibold py-3 hover:bg-[#00b2ec] hover:text-white transition-all duration-300">
                          Request Info
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center">
                  <div className="bg-gradient-to-br from-[#00b2ec]/10 to-[#e50d92]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-[#00b2ec]" />
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
      <section className="py-24 px-4 lg:px-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#00b2ec]/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#e50d92]/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-4">
              Why Our Training Academy{" "}
              <span className="bg-gradient-to-r from-[#00b2ec] to-[#e50d92] bg-clip-text text-transparent">
                Matters
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              We&apos;re not just providing training—we&apos;re building the foundation for healthcare excellence across Nigeria
            </p>
          </div>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                Icon: Users,
                title: "Combatting Brain Drain",
                desc: 'We invest in those who stay, ensuring that "home-based care" means world-class care and creating pathways for excellence at home.',
              },
              {
                Icon: Award,
                title: "Preventing Patient Harm",
                desc: "We empower caregivers and clinicians with the confidence and skill to perform procedures safely and effectively.",
              },
              {
                Icon: Target,
                title: "Building Specialized Manpower",
                desc: "Training the specialists that the Nigerian healthcare landscape currently lacks, filling critical gaps in expertise.",
              },
              {
                Icon: Zap,
                title: "World-Class Standards",
                desc: "Moving beyond theory into high-impact, practical mastery for real-world excellence and immediate application.",
              },
            ].map((card, idx) => {
              const accent = idx % 2 === 0 ? BRAND_CYAN : BRAND_MAGENTA;
              return (
                <div key={idx} className="group relative">
                  <div
                    className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `${accent}26` }}
                  />
                  <Card className="relative p-10 bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: accent }} />

                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${accent}1a` }}
                      >
                        <card.Icon className="w-7 h-7" style={{ color: accent }} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 pt-1">{card.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-base font-light">{card.desc}</p>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Featured Quote Section */}
          <div className="relative mt-20">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00b2ec] to-[#e50d92] rounded-3xl blur-2xl opacity-20" />
            <div className="relative bg-gradient-to-br from-[#00b2ec] via-[#0088b8] to-[#e50d92] rounded-3xl p-12 lg:p-16 shadow-2xl overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10" />

              <div className="relative z-10 text-center">
                <p className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-relaxed">
                  &ldquo;The rite path to full recovery starts with the rite training.&rdquo;
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
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-600 mb-10 font-light">
            Join healthcare professionals across Nigeria in elevating standards of care through our specialized training programs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://nestuge.com/ivjxuy9om" target="_blank">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00b2ec] to-[#0088b8] hover:from-[#0088b8] hover:to-[#00b2ec] text-white rounded-full font-semibold shadow-lg shadow-[#00b2ec]/30 hover:shadow-xl hover:shadow-[#00b2ec]/40 transition-all duration-300"
              >
                Enroll in a Program
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/support">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#00b2ec] text-[#00b2ec] rounded-full font-semibold hover:bg-[#00b2ec] hover:text-white transition-all duration-300"
              >
                Contact Us
              </Button>
            </Link>
          </div>

          <p className="text-gray-500 mt-8 font-light">
            For more information about enrollment, schedules, and fees, reach out to our academy team.
          </p>
        </div>
      </section>
    </main>
  );
}
