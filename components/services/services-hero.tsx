"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/public/service-hero.jpg";

const services = [
  {
    id: "Neurorehabilitation",
    title: "Neurorehabilitation",
    subtitle: "Specialized care for neurological conditions and recovery",
    href: "/neurorehabilitation",
  },
  {
    id: "post-icu",
    title: "Post-ICU Recovery Care",
    subtitle: "Transition support and monitoring after discharge",
    href: "/post-icu-care",
  },
  {
    id: "post-surgical-care",
    title: "Post-Surgical Care ",
    subtitle: "Targeted sessions to restore movement and strength",
    href: "/physiotherapy-sessions",
  },
  {
    id: "end-of-life-care",
    title: "End-of-Life Care and Palliative Care",
    subtitle:
      "Our palliative care is a holistic approach focused on symptom relief and emotional support.",
    href: "/end-of-life-care",
  },
  {
    id: "geriatric-care",
    title: "Geriatric Care",
    subtitle:
      "We focus on safety, nutrition, and mental engagement to preserve the quality of life for our seniors.",
    href: "/geriatric-care",
  },
  {
    id: "chronic-wound-care",
    title: "Chronic Wound Care",
    subtitle: "",
    href: "/chronic-wound-care",
  },
  {
    id: "home-medical-consultations",
    title: "Home Medical Consultations",
    subtitle:
      "We can help you skip the hospital wait time and our qualified physicians can provide comprehensive check-ups and medical reviews in the privacy of your home.",
    href: "/home-medical-consultations",
  },
  {
    id: "routine-laboratory-services",
    title: "Routine Laboratory Services",
    subtitle: "Professional sample collection for blood work, urinalysis, and screenings with digital results delivered straight to your inbox.",
    href: "/routine-laboratory-services",
  },
  {
    id: "physiotherapy-services",
    title: "Physiotherapy Services",
    subtitle: "Targeted physical therapy for musculoskeletal issues, back pain, and sports injuries to keep you moving pain-free.",
    href: "/physiotherapy-services",
  },
  {
    id: "postpartum-care",
    title: "Postpartum Care",
    subtitle: "Specialized care for new mothers during the post-delivery recovery period.",
    href: "/postpartum-care",
  }
];

export function ServicesHero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    timeoutRef.current = window.setTimeout(() => {
      setIndex((v) => (v + 1) % services.length);
    }, 5000);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [index, paused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function prev() {
    setIndex((v) => (v - 1 + services.length) % services.length);
  }

  function next() {
    setIndex((v) => (v + 1) % services.length);
  }

  return (
    <section
      className="relative overflow-hidden bg-slate-900/60 pt-28 pb-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Image
        src={heroImage}
        alt="Services background"
        fill
        className="object-cover object-top opacity-30 pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-white text-3xl font-bold">Our Services</h2>
            <p className="text-slate-200 mt-1 max-w-xl">
              Expert home-based care across post-acute, rehabilitation and
              ongoing support — tailored to each family's needs.
            </p>
          </div>

          <div className="hidden sm:flex gap-3">
            <button
              aria-label="Previous service"
              onClick={prev}
              className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              aria-label="Next service"
              onClick={next}
              className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {services.map((s) => (
                <article key={s.id} className="min-w-full px-2 md:px-6 pb-8">
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2">
                      <h3 className="text-2xl md:text-3xl font-semibold text-white">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-slate-200 max-w-xl">
                        {s.subtitle}
                      </p>

                      <div className="mt-6 flex gap-4">
                        <Link href={s.href} className="inline-block">
                          <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 cursor-pointer rounded-[2rem]">
                            Learn more
                          </Button>
                        </Link>
                        <Link
                          href="/client/booking"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block"
                        >
                          <Button
                            size="lg"
                            variant="outline"
                            className="bg-accent text-white border-none cursor-pointer hover:text-white rounded-[2rem]"
                          >
                            Book consultation
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* <div className="w-full md:w-1/2 flex items-center justify-center">
                      <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl">
                        <div
                          className={`h-56 bg-gradient-to-br from-slate-500 to-slate-400 flex items-center justify-center text-white`}
                        >
                          <div className="text-center px-6">
                            <div className="text-3xl font-bold">
                              {s.title.split(" ")[0]}
                            </div>
                            <div className="text-sm opacity-90 mt-1">
                              {s.subtitle}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {services.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full ${
                  i === index ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
