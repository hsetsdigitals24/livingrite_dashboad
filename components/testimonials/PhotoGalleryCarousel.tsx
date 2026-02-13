"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Keyboard, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";

interface GalleryImage {
  url?: string;
  caption?: string;
  alt?: string;
}

type PhotoGalleryCarouselProps = {
  images?: (string | GalleryImage)[];
  title?: string;
};

// Default demo gallery
const DEFAULT_GALLERY = [
  {
    url: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=800&h=600&fit=crop",
    caption: "Patient care and support",
    alt: "Professional caregiver assisting patient",
  },
  {
    url: "https://images.unsplash.com/photo-1631217267830-ab7d9b7d7534?w=800&h=600&fit=crop",
    caption: "Recovery progress sessions",
    alt: "Physical therapy session",
  },
  {
    url: "https://images.unsplash.com/photo-1576091160019-112a08978e27?w=800&h=600&fit=crop",
    caption: "Family support moments",
    alt: "Family visiting patient",
  },
];

export function PhotoGalleryCarousel({ 
  images = DEFAULT_GALLERY, 
  title = "Photo Gallery" 
}: PhotoGalleryCarouselProps) {
  const [mounted, setMounted] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Normalize images to object format
  const normalizedImages = images.map((img) => {
    if (typeof img === "string") {
      return { url: img, caption: "", alt: "Gallery image" };
    }
    return { url: img.url || "", caption: img.caption || "", alt: img.alt || "Gallery image" };
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || normalizedImages.length === 0) {
    return null;
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === "ArrowLeft") {
      setLightboxIndex((prev) =>
        prev === 0 ? normalizedImages.length - 1 : prev - 1
      );
    } else if (e.key === "ArrowRight") {
      setLightboxIndex((prev) =>
        prev === normalizedImages.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === "Escape") {
      setLightboxOpen(false);
    }
  };

  useEffect(() => {
    if (lightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [lightboxOpen, normalizedImages.length]);

  return (
    <>
      <div className="space-y-4">
        {/* Main carousel */}
        <div className="relative bg-gray-900 rounded-xl overflow-hidden">
          <Swiper
            modules={[Navigation, Thumbs, Keyboard, Pagination]}
            thumbs={{ swiper: thumbsSwiper }}
            navigation={{
              prevEl: ".gallery-prev",
              nextEl: ".gallery-next",
            }}
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            loop={normalizedImages.length > 1}
            className="w-full aspect-video"
          >
            {normalizedImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${title} image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={index === 0}
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Caption */}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                      <p className="text-sm font-medium text-white">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons */}
          {normalizedImages.length > 1 && (
            <>
              <button
                className="gallery-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <button
                className="gallery-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-6 right-6 bg-black/60 text-white px-3 py-1 rounded-lg text-sm z-10">
            {lightboxIndex + 1} / {normalizedImages.length}
          </div>
        </div>

        {/* Thumbnail strip */}
        {normalizedImages.length > 1 && (
          <div className="bg-gray-100 rounded-lg p-3">
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              slidesPerView={6}
              spaceBetween={8}
              freeMode={true}
              watchSlidesProgress={true}
              breakpoints={{
                320: { slidesPerView: 4, spaceBetween: 6 },
                640: { slidesPerView: 5, spaceBetween: 8 },
                768: { slidesPerView: 6, spaceBetween: 8 },
              }}
              className="w-full"
            >
              {normalizedImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full aspect-square cursor-pointer rounded-lg overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-colors">
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image display */}
          <div className="relative w-full h-full max-w-5xl max-h-96 md:max-h-screen flex items-center justify-center">
            <Image
              src={normalizedImages[lightboxIndex].url}
              alt={normalizedImages[lightboxIndex].alt || `Image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Navigation */}
          {normalizedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === 0 ? normalizedImages.length - 1 : prev - 1
                  );
                }}
                className="absolute left-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === normalizedImages.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Bottom Info */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="mb-2 text-sm text-white/80">
              {lightboxIndex + 1} / {normalizedImages.length}
            </p>
            {normalizedImages[lightboxIndex].caption && (
              <p className="text-sm font-medium text-white">
                {normalizedImages[lightboxIndex].caption}
              </p>
            )}
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-4 left-4 text-xs text-white/50">
            ← → Arrow keys • ESC to close
          </div>
        </div>
      )}

      {/* Info Text */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Click any image to view full size • {normalizedImages.length} {normalizedImages.length === 1 ? "photo" : "photos"}
      </p>
    </>
  );
}
