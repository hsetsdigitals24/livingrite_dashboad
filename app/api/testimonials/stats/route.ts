import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/testimonials/stats
 * Fetch aggregated rating statistics
 */
export async function GET() {
  try {
    // Fetch all approved testimonials
    const testimonials = await prisma.testimonial.findMany({
      where: {
        status: 'APPROVED',
      },
      select: {
        rating: true,
      },
    })

    if (testimonials.length === 0) {
      return NextResponse.json(
        {
          averageRating: 0,
          totalRatings: 0,
          distribution: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          },
        },
        { status: 200 }
      )
    }

    // Calculate statistics
    const totalRatings = testimonials.length
    const sumRatings = testimonials.reduce((sum, t) => sum + t.rating, 0)
    const averageRating = sumRatings / totalRatings

    // Count distribution
    const distribution = {
      5: testimonials.filter((t) => t.rating === 5).length,
      4: testimonials.filter((t) => t.rating === 4).length,
      3: testimonials.filter((t) => t.rating === 3).length,
      2: testimonials.filter((t) => t.rating === 2).length,
      1: testimonials.filter((t) => t.rating === 1).length,
    }

    return NextResponse.json(
      {
        averageRating: Number(averageRating.toFixed(1)),
        totalRatings,
        distribution,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching rating stats:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to fetch rating stats'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
