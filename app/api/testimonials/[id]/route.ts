import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/testimonials/[id]
 * Get a single testimonial by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id },
      include: {
        service: true,
      },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Only show non-approved testimonials to admins
    const session = await getServerSession(authOptions);
    if (
      testimonial.status !== "APPROVED" &&
      session?.user?.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/testimonials/[id]
 * Update a testimonial (admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check admin access
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate rating if provided
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: {
        ...(body.clientName !== undefined && { clientName: body.clientName }),
        ...(body.clientTitle !== undefined && { clientTitle: body.clientTitle }),
        ...(body.clientImage !== undefined && { clientImage: body.clientImage }),
        ...(body.rating !== undefined && { rating: body.rating }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
        ...(body.serviceId !== undefined && { serviceId: body.serviceId }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
        ...(body.status === "APPROVED" && {
          approvedAt: new Date(),
          approvedBy: session.user.id,
        }),
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/testimonials/[id]
 * Delete a testimonial (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check admin access
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.testimonial.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
