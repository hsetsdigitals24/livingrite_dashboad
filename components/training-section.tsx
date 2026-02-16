"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight, Calendar, Clock, Users } from "lucide-react";

interface TrainingProgram {
  id: string;
  title: string;
  date: string;
  duration: string;
  focus: string;
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
    color: "from-blue-600 to-blue-700",
    lightColor: "bg-blue-50 border-blue-200",
  },
  {
    id: "2",
    title: "BLS Training for First Responders & Caregivers",
    date: "14th & 15th March 2026",
    duration: "2 days",
    focus: "Essential Basic Life Support skills for emergency intervention",
    color: "from-red-600 to-red-700",
    lightColor: "bg-red-50 border-red-200",
  },
  {
    id: "3",
    title: "Caregivers' Training: Specialized Post-Stroke Care",
    date: "14th – 30th March 2026",
    duration: "17 days",
    focus: "Mastering complexities of caring for stroke survivors",
    color: "from-purple-600 to-purple-700",
    lightColor: "bg-purple-50 border-purple-200",
  },
  {
    id: "4",
    title: "Nursing Training for Critical Care Nursing",
    date: "1st – 15th April 2026",
    duration: "15 days",
    focus: "Managing patients in critical recovery phases",
    color: "from-orange-600 to-orange-700",
    lightColor: "bg-orange-50 border-orange-200",
  },
  {
    id: "5",
    title: "Ultrasound-Guided Phlebotomy for Clinicians",
    date: "1st – 10th May 2026",
    duration: "10 days",
    focus: "Advanced vascular access techniques for clinicians",
    color: "from-teal-600 to-teal-700",
    lightColor: "bg-teal-50 border-teal-200",
  },
];

const benefits = [
  "Combatting Brain Drain: We invest in those who stay",
  "Preventing Patient Harm: Empowering caregivers with safety",
  "Building Specialized Manpower: Training future specialists",
  "World-Class Care Standards: Elevating domestic healthcare",
];

export function TrainingSection() {
  return (
    <section className="py-16 px-4 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
            Training & Academy
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Building specialized manpower to bridge Nigeria's healthcare gap. Our intensive, practical training programs equip healthcare professionals with world-class clinical skills.
          </p>
        </div>

        {/* Hero Message */}
        <div className="bg-gradient-to-r from-primary/10 to-cyan-600/10 border border-primary/20 rounded-2xl p-8 lg:p-12 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Closing the Care Gap: Building the Manpower Nigeria Needs
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nigeria's healthcare system is at a crossroads. As many professionals seek opportunities abroad, the dedicated nurses, clinicians, and caregivers who remain are often left without the advanced, specialized training required for complex out-of-hospital care.
          </p>
          <p className="text-gray-700 leading-relaxed">
            At LivingRite Care, we are stepping in to bridge this gap. We are a capacity-building company dedicated to equipping the next generation of healthcare providers with the clinical precision and requisite skills needed to protect and restore the lives of our citizens.
          </p>
        </div>

        {/* Training Programs Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our 2026 Training Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card
                key={program.id}
                className={`${program.lightColor} border-2 hover:shadow-xl transition-all duration-300 overflow-hidden group`}
              >
                <div
                  className={`h-1 bg-gradient-to-r ${program.color}`}
                />
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                    {program.title}
                  </h4>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold text-gray-900">
                          {program.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold text-gray-900">
                          {program.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Focus Area</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {program.focus}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link href="/training">
                    <Button className="w-full bg-gradient-to-r from-primary to-cyan-600 hover:shadow-lg transition-all duration-300">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Why It Matters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Why Our Training Academy Matters
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/20">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed pt-1">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-cyan-600/20 rounded-2xl p-8 lg:p-12 border border-primary/30">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Hands-On, Practical Learning
                </h4>
                <p className="text-gray-700">
                  Our curriculum moves beyond theory into high-impact, practical mastery designed for real-world application.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Expert-Led Training
                </h4>
                <p className="text-gray-700">
                  Learn from experienced clinicians and trainers who understand Nigeria's unique healthcare challenges.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Certification Upon Completion
                </h4>
                <p className="text-gray-700">
                  Earn recognized credentials that validate your expertise and advance your healthcare career.
                </p>
              </div>

              <div className="pt-4 border-t border-primary/20">
                <p className="italic text-gray-800 font-semibold">
                  "The rite path to full recovery starts with the rite training."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-cyan-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Elevate Your Clinical Practice?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join us in building specialized manpower and delivering world-class out-of-hospital care to Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/training">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 rounded-full font-semibold"
              >
                Explore All Programs
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10 rounded-full font-semibold"
            >
              Contact Us for Enrollment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrainingSection;
