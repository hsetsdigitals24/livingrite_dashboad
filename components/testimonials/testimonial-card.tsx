"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface TestimonialCardProps {
  clientName: string
  clientTitle?: string
  clientImage?: string
  rating: number
  content: string
  service?: { title: string; slug: string }
}

export function TestimonialCard({
  clientName,
  clientTitle,
  clientImage,
  rating,
  content,
  service,
}: TestimonialCardProps) {
  return (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Quote text */}
        <p className="text-gray-700 italic mb-6 flex-1 line-clamp-4">"{content}"</p>

        {/* Star rating */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mb-4" />

        {/* Client info */}
        <div className="flex items-center gap-3">
          {clientImage ? (
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              <Image
                src={clientImage}
                alt={clientName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{clientName.charAt(0)}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{clientName}</p>
            {clientTitle && <p className="text-xs text-gray-500 truncate">{clientTitle}</p>}
            {service && <p className="text-xs text-blue-600 font-medium truncate">{service.title}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
