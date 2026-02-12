import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/case-studies
 * Fetch approved case studies, optionally filtered by service
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

    const caseStudies = await prisma.caseStudy.findMany({
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

    return NextResponse.json({
      success: true,
      data: caseStudies,
      count: caseStudies.length,
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
 * POST /api/case-studies
 * Create a new case study (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    // Check admin access
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!body.slug || !body.title || !body.clientName || !body.challenge || !body.solution || !body.outcome || !body.narrative) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingSlug = await prisma.caseStudy.findUnique({
      where: { slug: body.slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug must be unique" },
        { status: 400 }
      );
    }

    const caseStudy = await prisma.caseStudy.create({
      data: {
        slug: body.slug,
        title: body.title,
        clientName: body.clientName,
        serviceId: body.serviceId || null,
        challenge: body.challenge,
        solution: body.solution,
        outcome: body.outcome,
        narrative: body.narrative,
        heroImage: body.heroImage || null,
        beforeImage: body.beforeImage || null,
        afterImage: body.afterImage || null,
        images: body.images || [],
        videoUrl: body.videoUrl || null,
        rating: body.rating || null,
        timeline: body.timeline || null,
        keyResults: body.keyResults || null,
        status: "APPROVED",
        approvedBy: session.user.id,
        approvedAt: new Date(),
        featured: false,
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: caseStudy,
        message: "Case study created",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating case study:", error);
    return NextResponse.json(
      { error: "Failed to create case study" },
      { status: 500 }
    );
  }
}
