import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/case-studies/[slug]
 * Get a single case study by slug
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { slug: params.slug },
      include: {
        service: true,
      },
    });

    if (!caseStudy) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      );
    }

    // Only show non-approved case studies to admins
    const session = await getServerSession(authOptions);
    if (
      caseStudy.status !== "APPROVED" &&
      session?.user?.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: caseStudy,
    });
  } catch (error) {
    console.error("Error fetching case study:", error);
    return NextResponse.json(
      { error: "Failed to fetch case study" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/case-studies/[slug]
 * Update a case study (admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
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

    // If slug is being changed, verify new slug is unique
    if (body.slug && body.slug !== params.slug) {
      const existingSlug = await prisma.caseStudy.findUnique({
        where: { slug: body.slug },
      });
      if (existingSlug) {
        return NextResponse.json(
          { error: "Slug must be unique" },
          { status: 400 }
        );
      }
    }

    const caseStudy = await prisma.caseStudy.update({
      where: { slug: params.slug },
      data: {
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.clientName !== undefined && { clientName: body.clientName }),
        ...(body.serviceId !== undefined && { serviceId: body.serviceId }),
        ...(body.challenge !== undefined && { challenge: body.challenge }),
        ...(body.solution !== undefined && { solution: body.solution }),
        ...(body.outcome !== undefined && { outcome: body.outcome }),
        ...(body.narrative !== undefined && { narrative: body.narrative }),
        ...(body.heroImage !== undefined && { heroImage: body.heroImage }),
        ...(body.beforeImage !== undefined && { beforeImage: body.beforeImage }),
        ...(body.afterImage !== undefined && { afterImage: body.afterImage }),
        ...(body.images !== undefined && { images: body.images }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
        ...(body.rating !== undefined && { rating: body.rating }),
        ...(body.timeline !== undefined && { timeline: body.timeline }),
        ...(body.keyResults !== undefined && { keyResults: body.keyResults }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: caseStudy,
    });
  } catch (error) {
    console.error("Error updating case study:", error);
    return NextResponse.json(
      { error: "Failed to update case study" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/case-studies/[slug]
 * Delete a case study (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
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

    await prisma.caseStudy.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({
      success: true,
      message: "Case study deleted",
    });
  } catch (error) {
    console.error("Error deleting case study:", error);
    return NextResponse.json(
      { error: "Failed to delete case study" },
      { status: 500 }
    );
  }
}
