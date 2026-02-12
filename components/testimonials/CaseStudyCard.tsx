"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CaseStudyCardProps {
  slug: string;
  title: string;
  clientName: string;
  heroImage?: string;
  challenge: string;
  outcome: string;
  serviceName?: string;
  timeline?: string;
}

export function CaseStudyCard({
  slug,
  title,
  clientName,
  heroImage,
  challenge,
  outcome,
  serviceName,
  timeline,
}: CaseStudyCardProps) {
  return (
    <Link href={`/testimonials/${slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        {/* Hero image */}
        {heroImage ? (
          <div className="relative w-full h-48 bg-gray-200">
            <Image
              src={heroImage}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-teal-700 font-medium">Case Study</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Service badge */}
          {serviceName && (
            <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {serviceName}
            </span>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Client name */}
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Client:</span> {clientName}
          </p>

          {/* Timeline */}
          {timeline && (
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-semibold">Timeline:</span> {timeline}
            </p>
          )}

          {/* Challenge snippet */}
          <div className="mb-4">
            <p className="text-sm text-gray-700 line-clamp-2">
              <span className="font-semibold block mb-1">Challenge:</span>
              {challenge}
            </p>
          </div>

          {/* Outcome snippet */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 line-clamp-2">
              <span className="font-semibold block mb-1">Outcome:</span>
              {outcome}
            </p>
          </div>

          {/* Read more button */}
          <div className="flex items-center text-teal-600 font-semibold text-sm group">
            Read full story
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
