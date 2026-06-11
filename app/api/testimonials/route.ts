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
<<<<<<< HEAD
    const widget = searchParams.get("widget");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
=======
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10) || 50, 100);
    const skip = Math.max(parseInt(searchParams.get("skip") || "0", 10) || 0, 0);
>>>>>>> e236575ff69b80fc5e3793acf3d4ac04ff91ccb1

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

<<<<<<< HEAD
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
=======
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
>>>>>>> e236575ff69b80fc5e3793acf3d4ac04ff91ccb1

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
<<<<<<< HEAD
        totalReviews: total,
        ratingDistribution: {
          5: ratings.filter((r) => r === 5).length,
          4: ratings.filter((r) => r === 4).length,
          3: ratings.filter((r) => r === 3).length,
          2: ratings.filter((r) => r === 2).length,
          1: ratings.filter((r) => r === 1).length,
        },
=======
        totalReviews,
        ratingDistribution,
>>>>>>> e236575ff69b80fc5e3793acf3d4ac04ff91ccb1
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
