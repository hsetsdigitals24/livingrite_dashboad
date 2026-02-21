"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface CaseStudyCardProps {
  id: string
  slug: string
  title: string
  clientName: string
  challenge: string
  outcome: string
  heroImage?: string
  rating?: number
  featured?: boolean
  service?: { title: string }
}

export function CaseStudyCard({
  slug,
  title,
  clientName,
  challenge,
  outcome,
  heroImage,
  rating,
  featured,
  service,
}: CaseStudyCardProps) {
  return (
    <Link href={`/testimonials/case-studies/${slug}`}>
      <Card className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full hover:border-blue-200 cursor-pointer group">
        {/* Image Container */}
        {heroImage && (
          <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
            <Image
              src={heroImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {featured && (
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 text-xs font-semibold px-3 py-1 rounded-full">
                Featured
              </div>
            )}
          </div>
        )}

        <CardContent className="p-6">
          {/* Service tag */}
          {service && (
            <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {service.title}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Client name */}
          <p className="text-sm text-gray-600 mb-3 font-medium">Client: {clientName}</p>

          {/* Challenge and Outcome */}
          <div className="space-y-2 mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Challenge</p>
              <p className="text-sm text-gray-700 line-clamp-2">{challenge}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Outcome</p>
              <p className="text-sm text-gray-700 line-clamp-2">{outcome}</p>
            </div>
          </div>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: rating }).map((_, i) => (
                <span key={i} className="text-amber-400">★</span>
              ))}
            </div>
          )}

          {/* Read more link */}
          <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
            Read Full Story
            <ChevronRight className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
