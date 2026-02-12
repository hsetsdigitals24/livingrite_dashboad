"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import ReactStars from "react-star-ratings";

interface TestimonialCardProps {
  id: string;
  clientName: string;
  clientTitle?: string;
  clientImage?: string;
  rating: number;
  content: string;
  videoUrl?: string;
  serviceName?: string;
}

export function TestimonialCard({
  id,
  clientName,
  clientTitle,
  clientImage,
  rating,
  content,
  videoUrl,
  serviceName,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Video embed if available */}
      {videoUrl && (
        <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-gray-100">
          <iframe
            src={videoUrl}
            title={clientName}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Star rating */}
      <div className="flex items-center gap-2 mb-4">
        <ReactStars
          count={5}
          rating={rating}
          size={18}
          color="#d1d5db"
          activeColor="#fbbf24"
          editing={false}
        />
        <span className="text-sm font-medium text-gray-600">
          {rating}.0/5.0
        </span>
      </div>

      {/* Quote */}
      <blockquote className="text-gray-700 italic mb-4 line-clamp-3">
        "{content}"
      </blockquote>

      {/* Client info */}
      <div className="flex items-center gap-3 mt-6">
        {clientImage ? (
          <Image
            src={clientImage}
            alt={clientName}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold">{clientName.charAt(0)}</span>
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{clientName}</p>
          {clientTitle && (
            <p className="text-sm text-gray-600">{clientTitle}</p>
          )}
          {serviceName && (
            <p className="text-xs text-teal-600 font-medium">{serviceName}</p>
          )}
        </div>
      </div>
    </div>
  );
}
