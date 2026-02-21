"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface VideoTestimonialCardProps {
  title: string
  clientName: string
  clientTitle?: string
  rating: number
  videoUrl: string
  isHero?: boolean
}

export function VideoTestimonialCard({
  title,
  clientName,
  clientTitle,
  rating,
  videoUrl,
  isHero = false,
}: VideoTestimonialCardProps) {
  const getVideoEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]?.split("?")[0]
        : url.split("v=")[1]?.split("&")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  }

  return (
    <Card className={`bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${isHero ? "" : ""}`}>
      <CardContent className={`p-0 ${isHero ? "p-0" : ""}`}>
        <div className={isHero ? "space-y-4 p-6" : ""}>
          {/* Video Container */}
          <div className={`${isHero ? "aspect-video" : "aspect-video"} bg-black rounded-lg overflow-hidden relative`}>
            <iframe
              src={getVideoEmbedUrl(videoUrl)}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {!isHero && (
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{clientName}</p>
                  {clientTitle && <p className="text-xs text-gray-500">{clientTitle}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          )}

          {isHero && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{clientName}</p>
                  {clientTitle && <p className="text-sm text-gray-500">{clientTitle}</p>}
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
