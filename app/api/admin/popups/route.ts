import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all popups, not just the first one
    const popups = await prisma.landingPagePopup.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json(popups);
  } catch (error) {
    console.error("Fetch popup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      imageAlt,
      actionButtonText,
      actionButtonUrl,
      isActive,
      displayOrder,
    } = body;

    // Validate required fields
    if (!title || !actionButtonText || !actionButtonUrl) {
      return NextResponse.json(
        { error: "Missing required fields: title, actionButtonText, actionButtonUrl" },
        { status: 400 }
      );
    }

    const popup = await prisma.landingPagePopup.create({
      data: {
        title,
        description: description || null,
        imageUrl: imageUrl || null,
        imageAlt: imageAlt || null,
        actionButtonText,
        actionButtonUrl,
        isActive: isActive ?? true,
        displayOrder: displayOrder ?? 0,
      },
    });

    return NextResponse.json(popup, { status: 201 });
  } catch (error) {
    console.error("Create popup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
