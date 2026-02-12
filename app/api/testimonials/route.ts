import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/testimonials
 * Fetch approved testimonials, optionally filtered by service
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

    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
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
 * POST /api/testimonials
 * Create a new testimonial (public submission or admin)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    // Validate required fields
    if (!body.clientName || !body.content) {
      return NextResponse.json(
        { error: "Client name and content are required" },
        { status: 400 }
      );
    }

    // Rating validation
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Auto-approve for admin, pending for public submissions
    const status = session?.user?.role === "ADMIN" ? "APPROVED" : "PENDING";
    const approvedAt = session?.user?.role === "ADMIN" ? new Date() : null;
    const approvedBy = session?.user?.id;

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName: body.clientName,
        clientTitle: body.clientTitle || null,
        clientImage: body.clientImage || null,
        rating: body.rating || 5,
        content: body.content,
        videoUrl: body.videoUrl || null,
        serviceId: body.serviceId || null,
        status,
        approvedAt: status === "APPROVED" ? new Date() : null,
        approvedBy: status === "APPROVED" ? approvedBy : null,
        featured: false,
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: testimonial,
        message: status === "PENDING" ? "Testimonial submitted for review" : "Testimonial created",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
