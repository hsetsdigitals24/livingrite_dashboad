import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Pages that read testimonials from Prisma and are statically/ISR rendered.
// Revalidate them on every mutation so admin changes show up immediately.
function revalidateTestimonialPages() {
  try {
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/testimonials");
  } catch (err) {
    // A revalidation hiccup must never fail the API response.
    console.error("Failed to revalidate testimonial pages:", err);
  }
}

const includeRelations = {
  service: { select: { id: true, title: true } },
  approver: { select: { id: true, name: true, email: true } },
};

// clientImage is stored as a base64 data URI in the DB. Reject anything larger
// than ~2MB so an oversized payload fails cleanly instead of bloating the row.
const MAX_IMAGE_CHARS = 2 * 1024 * 1024;

function imageTooLarge(clientImage: unknown): boolean {
  return typeof clientImage === "string" && clientImage.length > MAX_IMAGE_CHARS;
}

/**
 * GET /api/admin/testimonials
 * List testimonials with filtering and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const serviceId = searchParams.get("serviceId");
    const featured = searchParams.get("featured");
    const showOnWidget = searchParams.get("showOnWidget");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (serviceId) where.serviceId = serviceId;
    if (featured === "true") where.featured = true;
    if (featured === "false") where.featured = false;
    if (showOnWidget === "true") where.showOnWidget = true;
    if (showOnWidget === "false") where.showOnWidget = false;
    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { clientLocation: { contains: search, mode: "insensitive" } },
      ];
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: includeRelations,
        orderBy: [
          { featured: "desc" },
          { displayOrder: "asc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNextPage: page < pages,
        hasPreviousPage: page > 1,
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

/**
 * POST /api/admin/testimonials
 * Create a new testimonial (admin-authored, approved by default)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.clientName || !body.content) {
      return NextResponse.json(
        { error: "clientName and content are required" },
        { status: 400 }
      );
    }

    const rating = Number(body.rating);
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (imageTooLarge(body.clientImage)) {
      return NextResponse.json(
        { error: "Image is too large. Please use a smaller photo." },
        { status: 400 }
      );
    }

    const status = body.status || "APPROVED";

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName: body.clientName,
        clientTitle: body.clientTitle || null,
        clientLocation: body.clientLocation || null,
        clientImage: body.clientImage || null,
        rating,
        content: body.content,
        shortQuote: body.shortQuote || null,
        videoUrl: body.videoUrl || null,
        serviceId: body.serviceId || null,
        featured: body.featured ?? false,
        showOnWidget: body.showOnWidget ?? false,
        status,
        displayOrder:
          body.displayOrder !== undefined && body.displayOrder !== ""
            ? Number(body.displayOrder)
            : null,
        approvedBy: status === "APPROVED" ? session.user.id : null,
        approvedAt: status === "APPROVED" ? new Date() : null,
      },
      include: includeRelations,
    });

    revalidateTestimonialPages();

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/testimonials?id=...
 * Update a testimonial
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (imageTooLarge(body.clientImage)) {
      return NextResponse.json(
        { error: "Image is too large. Please use a smaller photo." },
        { status: 400 }
      );
    }

    const data: any = {
      ...(body.clientName !== undefined && { clientName: body.clientName }),
      ...(body.clientTitle !== undefined && { clientTitle: body.clientTitle || null }),
      ...(body.clientLocation !== undefined && { clientLocation: body.clientLocation || null }),
      ...(body.clientImage !== undefined && { clientImage: body.clientImage || null }),
      ...(body.rating !== undefined && { rating: Number(body.rating) }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.shortQuote !== undefined && { shortQuote: body.shortQuote || null }),
      ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl || null }),
      ...(body.serviceId !== undefined && { serviceId: body.serviceId || null }),
      ...(body.featured !== undefined && { featured: body.featured }),
      ...(body.showOnWidget !== undefined && { showOnWidget: body.showOnWidget }),
      ...(body.displayOrder !== undefined && {
        displayOrder:
          body.displayOrder === "" || body.displayOrder === null
            ? null
            : Number(body.displayOrder),
      }),
    };

    // Keep approval metadata in sync when status changes
    if (body.status !== undefined) {
      data.status = body.status;
      if (body.status === "APPROVED" || body.status === "FEATURED") {
        data.approvedBy = session.user.id;
        data.approvedAt = new Date();
      }
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
      include: includeRelations,
    });

    revalidateTestimonialPages();

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/testimonials?id=...
 * Delete a testimonial
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    await prisma.testimonial.delete({ where: { id } });

    revalidateTestimonialPages();

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
