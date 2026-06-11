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

    // Paginated mode
    const paginate = pageParam !== null || limitParam !== null;
    const page = Math.max(1, parseInt(pageParam || "1"));
    const limit = Math.max(1, parseInt(limitParam || "9"));

    const [rows, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include,
        orderBy,
        ...(paginate ? { skip: (page - 1) * limit, take: limit } : {}),
      }),
      prisma.testimonial.count({ where }),
    ]);

    const data = (rows as unknown as TestimonialWithService[]).map(toTestimonial);

    // Stats are computed across all approved (matching filters), not just this page
    const ratingRows = paginate
      ? await prisma.testimonial.findMany({ where, select: { rating: true } })
      : rows.map((r) => ({ rating: r.rating }));
    const ratings = ratingRows.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
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
        ratingDistribution: {
          5: ratings.filter((r) => r === 5).length,
          4: ratings.filter((r) => r === 4).length,
          3: ratings.filter((r) => r === 3).length,
          2: ratings.filter((r) => r === 2).length,
          1: ratings.filter((r) => r === 1).length,
        },
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
