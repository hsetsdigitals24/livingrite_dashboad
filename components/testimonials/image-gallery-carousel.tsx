"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageGalleryCarouselProps {
  images: string[]
  title?: string
}

export function ImageGalleryCarousel({ images, title }: ImageGalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay || images.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay, images.length])

  if (images.length === 0) {
    return null
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsAutoPlay(false)
  }

  return (
    <div className="space-y-4">
      <div
        className="relative w-full bg-gray-100 rounded-lg overflow-hidden group"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        {/* Main image */}
        <div className="relative w-full h-96 md:h-96 lg:h-96">
          <Image
            src={images[currentIndex]}
            alt={`${title || "Gallery"} image ${currentIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
          />
        </div>

        {/* Navigation buttons - only show if multiple images */}
        {images.length > 1 && (
          <>
            <Button
              onClick={goToPrevious}
              size="icon"
              variant="outline"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white border-0"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </Button>
            <Button
              onClick={goToNext}
              size="icon"
              variant="outline"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white border-0"
            >
              <ChevronRight className="w-5 h-5 text-gray-900" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail gallery - only show if multiple images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setIsAutoPlay(false)
              }}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                index === currentIndex ? "ring-2 ring-blue-500 opacity-100" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
