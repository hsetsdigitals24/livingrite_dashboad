'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

interface RatingStats {
  averageRating: number
  totalRatings: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export function RatingAggregation() {
  const [stats, setStats] = useState<RatingStats>({
    averageRating: 4.8,
    totalRatings: 147,
    distribution: {
      5: 130,
      4: 15,
      3: 2,
      2: 0,
      1: 0,
    },
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRatingStats()
  }, [])

  const fetchRatingStats = async () => {
    try {
      const res = await fetch('/api/testimonials/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch rating stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPercentage = (count: number) => {
    return stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 rounded-lg bg-gray-200"></div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8">
      {/* Main Rating Display */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-8 w-8 ${
                i < Math.floor(stats.averageRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="mt-4">
          <p className="text-5xl font-bold text-gray-900">
            {stats.averageRating.toFixed(1)}
          </p>
          <p className="text-gray-600">
            Based on {stats.totalRatings} verified reviews
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-4">
        <p className="font-semibold text-gray-900">Rating Breakdown</p>
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-4">
            <div className="flex items-center gap-1 w-12">
              <span className="text-sm font-medium text-gray-700">{rating}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                style={{ width: `${getPercentage(stats.distribution[rating as keyof typeof stats.distribution])}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">
              {stats.distribution[rating as keyof typeof stats.distribution]}
            </span>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 border-t border-gray-200 pt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">98%</p>
          <p className="text-xs text-gray-600">Recommend</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">500+</p>
          <p className="text-xs text-gray-600">Families Served</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">20+</p>
          <p className="text-xs text-gray-600">Years Combined</p>
        </div>
      </div>
    </div>
  )
}
