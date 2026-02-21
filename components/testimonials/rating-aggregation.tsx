"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface RatingAggregationProps {
  averageRating: number | string
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export function RatingAggregation({
  averageRating,
  totalReviews,
  ratingDistribution,
}: RatingAggregationProps) {
  const maxCount = Math.max(...Object.values(ratingDistribution))

  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900">{averageRating}</span>
              <span className="text-xl text-gray-500">/5</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(parseFloat(averageRating.toString()))
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">Based on {totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2 space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12 text-sm">
                  <span className="font-semibold text-gray-900">{rating}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
                    style={{
                      width:
                        maxCount > 0
                          ? `${(ratingDistribution[rating as keyof typeof ratingDistribution] / maxCount) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
