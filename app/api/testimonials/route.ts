import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/testimonials
 * Fetch approved testimonials, optionally filtered by service or featured status
 * Query params:
 *  - service: Filter by service ID
 *  - featured: true/false - only featured testimonials
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("service");
    const featured = searchParams.get("featured");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10) || 50, 100);
    const skip = Math.max(parseInt(searchParams.get("skip") || "0", 10) || 0, 0);

    const where: any = {
      status: "APPROVED",
    };

    if (serviceId) {
      where.serviceId = serviceId;
    }

    if (featured === "true") {
      where.featured = true;
    }

    // Push aggregate stats and distribution to the database instead of pulling
    // every testimonial into memory just to count by rating.
    const [testimonials, aggregate, distributionRows] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: { service: true },
        orderBy: [
          { featured: "desc" },
          { displayOrder: "asc" },
          { createdAt: "desc" },
        ],
        take: limit,
        skip,
      }),
      prisma.testimonial.aggregate({
        where,
        _avg: { rating: true },
        _count: { _all: true },
      }),
      prisma.testimonial.groupBy({
        by: ["rating"],
        where,
        _count: { _all: true },
      }),
    ]);

    const ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    };
    for (const row of distributionRows) {
      if (row.rating >= 1 && row.rating <= 5) {
        ratingDistribution[row.rating as 1 | 2 | 3 | 4 | 5] = row._count._all;
      }
    }

    const totalReviews = aggregate._count._all;
    const averageRating = aggregate._avg.rating
      ? aggregate._avg.rating.toFixed(1)
      : 0;

    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
      stats: {
        averageRating,
        totalReviews,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
