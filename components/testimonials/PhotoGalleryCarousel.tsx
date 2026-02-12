"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface PhotoGalleryCarouselProps {
  images: string[];
  title?: string;
}

export function PhotoGalleryCarousel({ images, title }: PhotoGalleryCarouselProps) {
  const [mounted, setMounted] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || images.length === 0) {
    return null;
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === "ArrowLeft") {
      setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else if (e.key === "ArrowRight") {
      setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (e.key === "Escape") {
      setLightboxOpen(false);
    }
  };

  useEffect(() => {
    if (lightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [lightboxOpen, images.length]);

  return (
    <>
      <div className="space-y-4">
        {/* Main carousel */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <Swiper
            modules={[Navigation, Thumbs]}
            thumbs={{ swiper: thumbsSwiper }}
            navigation={{
              prevEl: ".gallery-prev",
              nextEl: ".gallery-next",
            }}
            loop={images.length > 1}
            className="w-full aspect-video"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <Image
                    src={image}
                    alt={`${title || "Gallery"} image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                className="gallery-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <button
                className="gallery-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            slidesPerView={Math.min(6, images.length)}
            spaceBetween={8}
            className="w-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full aspect-video cursor-pointer rounded overflow-hidden border-2 border-transparent hover:border-teal-500 transition-colors">
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Lightbox modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>

          {/* Image display */}
          <div className="relative w-full h-full max-w-6xl max-h-96 md:max-h-screen flex items-center justify-center">
            <Image
              src={images[lightboxIndex]}
              alt={`${title || "Gallery"} image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              );
            }}
            className="absolute left-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              );
            }}
            className="absolute right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
