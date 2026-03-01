"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRightFromCircle, ChevronDown, Heart } from "lucide-react";
import Link from "next/link";
// import Video from "./Video";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#f5fbff] to-[#faf7ff]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Primary Gradient Orb - Top Left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#00b2ec] via-[#00b2ec]/50 to-transparent rounded-full blur-3xl opacity-20 animate-blob"></div>

        {/* Secondary Gradient Orb - Top Right */}
        <div className="absolute -top-16 right-0 w-80 h-80 bg-gradient-to-bl from-[#e50d92] via-[#e50d92]/40 to-transparent rounded-full blur-3xl opacity-15 animate-blob animation-delay-4000"></div>

        {/* Accent Orb - Bottom Left */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00b2ec]/30 to-transparent rounded-full blur-3xl opacity-10 animate-blob animation-delay-8000"></div>

        {/* Accent Orb Grid Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="heroGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00b2ec" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e50d92" stopOpacity="0.2" />
            </linearGradient>
            <filter id="heroGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Elegant circles */}
          <circle
            cx="10%"
            cy="15%"
            r="150"
            fill="none"
            stroke="url(#heroGradient)"
            strokeWidth="1.5"
            filter="url(#heroGlow)"
          />
          <circle
            cx="90%"
            cy="60%"
            r="180"
            fill="none"
            stroke="url(#heroGradient)"
            strokeWidth="1.5"
            filter="url(#heroGlow)"
          />
          <circle
            cx="50%"
            cy="95%"
            r="120"
            fill="none"
            stroke="url(#heroGradient)"
            strokeWidth="1.5"
            filter="url(#heroGlow)"
          />
        </svg>

        {/* Interactive cursor glow effect */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-[#00b2ec]/30 to-[#e50d92]/20 rounded-full blur-3xl opacity-0 transition-opacity duration-500 pointer-events-none mix-blend-screen"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            opacity:
              typeof window !== "undefined"
                ? Math.min(0.4, mousePosition.x / window.innerWidth) / 2
                : 0,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-80px)]">
          {/* Left Content */}
          <div className="max-w-2xl flex flex-col justify-center">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00b2ec]/10 to-[#e50d92]/5 border border-[#00b2ec]/30 text-[#0088b8] px-5 py-3 rounded-full text-sm font-semibold mb-8 animate-slide-up animation-delay-200 w-fit hover:border-[#00b2ec]/50 hover:shadow-lg hover:shadow-[#00b2ec]/10 transition-all duration-300">
              {/* Animated Heartbeat SVG Icon */}
              <svg
                className="h-4 w-4 animate-pulse"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12s4.477-10 10-10 10 4.477 10 10z"></path>
                <polyline points="12 8 12 12 15 15"></polyline>
              </svg>
              <span>Nigeria's Premier Home Healthcare</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight animate-slide-up animation-delay-300 tracking-tight">
              Healing Happens Best Where{" "}
              <span className="bg-gradient-to-r from-[#00b2ec] via-[#0088b8] to-[#e50d92] bg-clip-text text-transparent animate-gradient-shift">
                You Are Most Loved.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl animate-slide-up animation-delay-400 font-light">
              We bridge the gap between hospital discharge and daily life. From
              stroke recovery to specialist caregiver training, we provide the
              clinical expertise you need to lift the burden and focus on
              getting better.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up animation-delay-500">
              <Link
                href="/client/booking"
                className="flex items-center group/btn"
              >
                <Button
                  size="lg"
                  className="cursor-pointer text-base font-semibold bg-gradient-to-r from-[#00b2ec] to-[#0088b8] hover:from-[#0088b8] hover:to-[#00b2ec] text-white shadow-xl shadow-[#00b2ec]/30 hover:shadow-2xl hover:shadow-[#00b2ec]/50 hover:scale-105 transition-all duration-300 rounded-full px-8 group-hover/btn:gap-3 overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Schedule Care Today
                    <ArrowUpRightFromCircle className="h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:translate-y-[-2px] transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/training" className="flex items-center group/btn">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base font-semibold text-[#0088b8] border-[#00b2ec]/40 hover:bg-[#00b2ec]/5 hover:border-[#00b2ec]/60 rounded-full px-8 transition-all duration-300"
                >
                  Register for Caregiver Training
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 animate-slide-up animation-delay-600">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#00b2ec]">500+</span>
                <span className="text-sm text-gray-600 font-medium">
                  Patients Served
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#e50d92]">98%</span>
                <span className="text-sm text-gray-600 font-medium">
                  Satisfaction
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#00b2ec]">24/7</span>
                <span className="text-sm text-gray-600 font-medium">
                  Support
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Video Player with Abstract Background SVG */}
          <div className="relative h-full flex items-center justify-center animate-slide-up animation-delay-400">
            {/* Abstract Background SVG */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <svg
                viewBox="0 0 500 600"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient
                    id="abstractGrad1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#00b2ec" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#0088b8" stopOpacity="0.1" />
                    <stop
                      offset="100%"
                      stopColor="#e50d92"
                      stopOpacity="0.15"
                    />
                  </linearGradient>
                  <linearGradient
                    id="abstractGrad2"
                    x1="100%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#e50d92" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00b2ec" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Geometric Shapes */}
                <circle cx="100" cy="150" r="80" fill="url(#abstractGrad1)" />
                <circle
                  cx="450"
                  cy="300"
                  r="100"
                  fill="url(#abstractGrad2)"
                  opacity="0.6"
                />
                <circle
                  cx="250"
                  cy="500"
                  r="90"
                  fill="url(#abstractGrad1)"
                  opacity="0.5"
                />

                {/* Waves */}
                <path
                  d="M 0 200 Q 125 150 250 200 T 500 200"
                  fill="none"
                  stroke="url(#abstractGrad2)"
                  strokeWidth="2"
                  opacity="0.4"
                />
                <path
                  d="M 0 350 Q 125 300 250 350 T 500 350"
                  fill="none"
                  stroke="url(#abstractGrad1)"
                  strokeWidth="2"
                  opacity="0.3"
                />

                {/* Medical Plus Icons */}
                <g opacity="0.3">
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="80"
                    stroke="#00b2ec"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="35"
                    y1="65"
                    x2="65"
                    y2="65"
                    stroke="#00b2ec"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <line
                    x1="420"
                    y1="120"
                    x2="420"
                    y2="150"
                    stroke="#e50d92"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="405"
                    y1="135"
                    x2="435"
                    y2="135"
                    stroke="#e50d92"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>

                {/* Geometric Lines */}
                <line
                  x1="0"
                  y1="100"
                  x2="500"
                  y2="150"
                  stroke="url(#abstractGrad1)"
                  strokeWidth="1.5"
                  opacity="0.2"
                />
                <line
                  x1="500"
                  y1="450"
                  x2="0"
                  y2="500"
                  stroke="url(#abstractGrad2)"
                  strokeWidth="1.5"
                  opacity="0.2"
                />

                {/* Animated Polygons */}
                <polygon
                  points="80,20 120,80 40,80"
                  fill="url(#abstractGrad1)"
                  opacity="0.4"
                  style={{ animation: "float 5s ease-in-out infinite" }}
                />
                <polygon
                  points="420,480 460,540 380,540"
                  fill="url(#abstractGrad2)"
                  opacity="0.3"
                  style={{
                    animation: "float 6s ease-in-out infinite",
                    animationDelay: "0.5s",
                  }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-[#0088b8]">
            <span className="text-sm font-medium opacity-70">
              Scroll to explore
            </span>
            <ChevronDown className="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
