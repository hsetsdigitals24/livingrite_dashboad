import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/case-studies
 * List case studies with filtering and pagination
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
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (serviceId) where.serviceId = serviceId;
    if (featured === "true") where.featured = true;
    if (featured === "false") where.featured = false;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { clientName: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const [caseStudies, total] = await Promise.all([
      prisma.caseStudy.findMany({
        where,
        include: {
          service: { select: { id: true, title: true } },
          approver: { select: { id: true, name: true, email: true } },
        },
        orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.caseStudy.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: caseStudies,
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
    console.error("Error fetching case studies:", error);
    return NextResponse.json(
      { error: "Failed to fetch case studies" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/case-studies
 * Create a new case study
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.clientName || !body.slug) {
      return NextResponse.json(
        { error: "Title, clientName, and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingSlug = await prisma.caseStudy.findUnique({
      where: { slug: body.slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const caseStudy = await prisma.caseStudy.create({
      data: {
        title: body.title,
        clientName: body.clientName,
        slug: body.slug,
        serviceId: body.serviceId || null,
        challenge: body.challenge || "",
        solution: body.solution || "",
        outcome: body.outcome || "",
        narrative: body.narrative || "",
        heroImage: body.heroImage || null,
        beforeImage: body.beforeImage || null,
        afterImage: body.afterImage || null,
        images: body.images || [],
        videoUrl: body.videoUrl || null,
        rating: body.rating || null,
        timeline: body.timeline || null,
        keyResults: body.keyResults || null,
        status: body.status || "PENDING",
        featured: body.featured || false,
        displayOrder: body.displayOrder || null,
        approvedBy: body.approvedBy || null,
      },
      include: {
        service: { select: { id: true, title: true } },
        approver: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: caseStudy,
    });
  } catch (error) {
    console.error("Error creating case study:", error);
    return NextResponse.json(
      { error: "Failed to create case study" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/case-studies/:id
 * Update a case study
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Case study ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Check if slug is unique (if being updated)
    if (body.slug) {
      const existingSlug = await prisma.caseStudy.findUnique({
        where: { slug: body.slug },
      });

      if (existingSlug && existingSlug.id !== id) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const caseStudy = await prisma.caseStudy.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.clientName && { clientName: body.clientName }),
        ...(body.slug && { slug: body.slug }),
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
        ...(body.approvedBy !== undefined && { approvedBy: body.approvedBy }),
        ...(body.approvedAt !== undefined && { approvedAt: body.approvedAt }),
      },
      include: {
        service: { select: { id: true, title: true } },
        approver: { select: { id: true, name: true, email: true } },
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
 * DELETE /api/admin/case-studies/:id
 * Delete a case study
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Case study ID is required" },
        { status: 400 }
      );
    }

    await prisma.caseStudy.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Case study deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting case study:", error);
    return NextResponse.json(
      { error: "Failed to delete case study" },
      { status: 500 }
    );
  }
}
