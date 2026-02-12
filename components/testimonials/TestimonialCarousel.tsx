"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ReactStars from "react-star-ratings";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string;
  clientImage?: string;
  rating: number;
  content: string;
  videoUrl?: string;
  service?: { title: string };
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || testimonials.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">No testimonials available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl: ".testimonial-prev",
          nextEl: ".testimonial-next",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={testimonials.length > 1}
        className="h-full"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <div className="p-8 md:p-12 min-h-96 flex flex-col justify-between">
              {/* Video or placeholder */}
              {testimonial.videoUrl ? (
                <div className="mb-6 aspect-video rounded-lg overflow-hidden bg-gray-100 max-w-2xl mx-auto">
                  <iframe
                    src={testimonial.videoUrl}
                    title={testimonial.clientName}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <ReactStars
                  count={5}
                  rating={testimonial.rating}
                  size={24}
                  color="#d1d5db"
                  activeColor="#fbbf24"
                  editing={false}
                />
              </div>

              {/* Quote */}
              <blockquote className="text-2xl md:text-3xl font-light text-gray-900 mb-6 italic">
                "{testimonial.content}"
              </blockquote>

              {/* Client info */}
              <div className="flex items-center gap-4 mt-6">
                {testimonial.clientImage ? (
                  <Image
                    src={testimonial.clientImage}
                    alt={testimonial.clientName}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl font-bold">
                      {testimonial.clientName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {testimonial.clientName}
                  </p>
                  {testimonial.clientTitle && (
                    <p className="text-gray-600">{testimonial.clientTitle}</p>
                  )}
                  {testimonial.service && (
                    <p className="text-sm text-teal-600 font-medium">
                      {testimonial.service.title}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation buttons */}
      {testimonials.length > 1 && (
        <>
          <button
            className="testimonial-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <button
            className="testimonial-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>
        </>
      )}
    </div>
  );
}
