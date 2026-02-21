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

    const where: any = {
      status: "APPROVED",
    };

    if (serviceId) {
      where.serviceId = serviceId;
    }

    if (featured === "true") {
      where.featured = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      include: {
        service: true,
      },
      orderBy: [
        { featured: "desc" },
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    // Calculate aggregated ratings
    const ratings = testimonials.map(t => t.rating);
    const averageRating = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 0;
    
    const ratingDistribution = {
      5: ratings.filter(r => r === 5).length,
      4: ratings.filter(r => r === 4).length,
      3: ratings.filter(r => r === 3).length,
      2: ratings.filter(r => r === 2).length,
      1: ratings.filter(r => r === 1).length,
    };

    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
      stats: {
        averageRating,
        totalReviews: testimonials.length,
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
