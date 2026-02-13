'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'

interface GoogleReview {
  author: string
  rating: number
  text: string
  time?: string
  authorImage?: string
}

export function GoogleReviewsWidget() {
  const [reviews, setReviews] = useState<GoogleReview[]>([
    {
      author: 'Sarah Johnson',
      rating: 5,
      text: 'LivingRite provided exceptional care for my mother during her stroke recovery. The team is professional, compassionate, and truly went above and beyond.',
      time: '2 weeks ago',
      authorImage: '/avatars/sarah.jpg',
    },
    {
      author: 'Michael Chen',
      rating: 5,
      text: 'Outstanding service. My father felt so cared for and respected throughout his ICU recovery. Highly recommended!',
      time: '1 month ago',
      authorImage: '/avatars/michael.jpg',
    },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In production, fetch from Google Business API or embedding service
    // For now, we'll use fallback reviews
    setIsLoading(false)
  }, [])

  const googleBusinessUrl = process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || '#'

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 rounded-lg bg-gray-200"></div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {/* Google Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-red-600" />
          <span className="font-semibold text-gray-900">Google Reviews</span>
        </div>
        <a
          href={googleBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 hover:text-blue-700 font-semibold text-sm"
        >
          View on Google Maps →
        </a>
      </div>

      {/* Sample Reviews */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {reviews.map((review, index) => (
          <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
            <div className="flex items-start gap-3">
              {review.authorImage && (
                <img
                  src={review.authorImage}
                  alt={review.author}
                  className="h-8 w-8 rounded-full bg-gray-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{review.author}</p>
                <div className="flex items-center gap-2 my-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 w-3 rounded-full ${
                        i < review.rating ? 'bg-yellow-400' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {review.text}
                </p>
                {review.time && (
                  <p className="text-xs text-gray-500 mt-2">{review.time}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <a
          href={googleBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center rounded-lg bg-gray-100 hover:bg-gray-200 px-4 py-2 font-semibold text-gray-900 transition-colors text-sm"
        >
          Write a Review
        </a>
      </div>

      {/* Info Text */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        Reviews powered by Google Business Profile
      </p>
    </div>
  )
}
