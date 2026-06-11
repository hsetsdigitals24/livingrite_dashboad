import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toTestimonial, type TestimonialWithService } from "@/types/testimonial";

/**
 * GET /api/testimonials
 * Fetch approved testimonials for the public site.
 * Query params:
 *  - service: filter by service ID
 *  - featured=true: only featured testimonials
 *  - widget=true: only testimonials curated for the widget (showOnWidget)
 *  - page, limit: server-side pagination (omit for all)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("service");
    const featured = searchParams.get("featured");
    const widget = searchParams.get("widget");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const where: any = { status: "APPROVED" };
    if (serviceId) where.serviceId = serviceId;
    if (featured === "true") where.featured = true;
    if (widget === "true") where.showOnWidget = true;

    const orderBy = [
      { featured: "desc" as const },
      { displayOrder: "asc" as const },
      { createdAt: "desc" as const },
    ];

    const include = { service: { select: { id: true, title: true } } };

    // Paginated when page/limit are supplied, otherwise return all matches.
    const paginate = pageParam !== null || limitParam !== null;
    const page = Math.max(1, parseInt(pageParam || "1"));
    const limit = Math.min(Math.max(1, parseInt(limitParam || "9")), 100);

    // Compute stats in the database (aggregate + groupBy) instead of pulling
    // every row into memory just to count by rating.
    const [rows, aggregate, distributionRows] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include,
        orderBy,
        ...(paginate ? { skip: (page - 1) * limit, take: limit } : {}),
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

    const data = (rows as unknown as TestimonialWithService[]).map(toTestimonial);

    const ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    };
    for (const row of distributionRows) {
      if (row.rating >= 1 && row.rating <= 5) {
        ratingDistribution[row.rating as 1 | 2 | 3 | 4 | 5] = row._count._all;
      }
    }

    const total = aggregate._count._all;
    const averageRating = aggregate._avg.rating
      ? aggregate._avg.rating.toFixed(1)
      : "0";

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
      pagination: {
        page: paginate ? page : 1,
        limit: paginate ? limit : total,
        total,
        pages: paginate ? Math.ceil(total / limit) : 1,
        hasNextPage: paginate ? page * limit < total : false,
        hasPreviousPage: paginate ? page > 1 : false,
      },
      stats: {
        averageRating,
        totalReviews: total,
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
