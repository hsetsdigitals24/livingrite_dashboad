"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, User, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Training {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  instructor?: string;
  duration?: number;
  createdAt: string;
}

export function TrainingSection() {
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestTraining = async () => {
      try {
        const response = await fetch("/api/trainings/latest");
        if (response.ok) {
          const data = await response.json();
          setTraining(data);
        }
      } catch (error) {
        console.error("Failed to fetch training:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTraining();
  }, []);

  if (loading || !training) {
    return null;
  }

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#ffffff] via-[#f5fbff] to-[#faf7ff] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-0 w-96 h-96 bg-gradient-to-br from-[#00b2ec]/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 right-0 w-96 h-96 bg-gradient-to-tr from-[#e50d92]/15 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00b2ec]/15 to-[#e50d92]/10 border border-[#00b2ec]/40 text-[#0088b8] px-4 py-3 rounded-full text-sm font-semibold mb-6 group hover:border-[#00b2ec]/60 hover:shadow-lg hover:shadow-[#00b2ec]/20 transition-all duration-300">
            <BookOpen className="h-4 w-4" />
            Caregiver Academy
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Learn Professional <br />
            <span className="bg-gradient-to-r from-[#00b2ec] via-[#0088b8] to-[#e50d92] bg-clip-text text-transparent animate-gradient-shift">
              Caregiving Skills
            </span>
          </h2>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Our comprehensive training programs equip caregivers with the knowledge and skills needed to provide exceptional, compassionate care.
          </p>
        </div>

        {/* Featured Training Card */}
        <div className="max-w-5xl mx-auto animate-slide-up animation-delay-300">
          <div className="relative bg-white rounded-3xl border border-[#00b2ec]/30 overflow-hidden shadow-2xl shadow-[#00b2ec]/15 group hover:shadow-3xl hover:shadow-[#00b2ec]/30 transition-all duration-500">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00b2ec]/15 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-8 p-10 lg:p-12">
              {/* Image Side */}
              {training.imageUrl && (
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#00b2ec]/10 to-[#e50d92]/5 group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={training.imageUrl}
                    alt={training.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badge */}
                  <div className="absolute top-6 left-6 bg-gradient-to-r from-[#00b2ec] to-[#0088b8] text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                    Featured
                  </div>
                </div>
              )}

              {/* Content Side */}
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-[#00b2ec] transition-colors duration-300">
                  {training.title}
                </h3>

                <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light">
                  {training.description}
                </p>

                {/* Training Details */}
                <div className="grid grid-cols-2 gap-4 mb-8 py-8 border-y border-gray-200">
                  {training.duration && (
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-[#00b2ec]/10 text-[#00b2ec]">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
                        <p className="text-lg font-bold text-gray-900">{training.duration} weeks</p>
                      </div>
                    </div>
                  )}
                  {training.instructor && (
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-[#e50d92]/10 text-[#e50d92]">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Instructor</p>
                        <p className="text-lg font-bold text-gray-900">{training.instructor}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Link href="/training" className="group/link">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#00b2ec] to-[#0088b8] hover:from-[#0088b8] hover:to-[#00b2ec] text-white shadow-xl shadow-[#00b2ec]/30 hover:shadow-2xl hover:shadow-[#00b2ec]/50 hover:scale-105 transition-all duration-300 rounded-full font-semibold"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Enroll Now
                      <ArrowRight className="h-5 w-5 group-hover/link:translate-x-2 transition-transform" />
                    </span>
                  </Button>
                </Link>

                <p className="text-center text-sm text-gray-500 mt-4 font-light">
                  Or explore all training programs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Grid */}
        <div className="mt-16 animate-slide-up animation-delay-400">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">More Training Programs</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "📚", title: "Basic Care Skills", desc: "Essential care techniques and patient hygiene" },
              { icon: "🏥", title: "Medical Procedures", desc: "Safe handling of medical equipment and monitoring" },
              { icon: "💪", title: "Physical Support", desc: "Safe moving, lifting, and mobility assistance" },
            ].map((program, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl border-2 border-[#00b2ec]/30 bg-white/80 hover:border-[#e50d92]/50 hover:shadow-xl hover:shadow-[#e50d92]/20 transition-all duration-300 group/card"
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover/card:text-[#00b2ec] transition-colors">
                  {program.title}
                </h4>
                <p className="text-gray-600 font-light mb-6">{program.desc}</p>
                <button className="inline-flex items-center gap-2 text-[#00b2ec] font-semibold hover:text-[#e50d92] transition-colors">
                  Learn more <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
