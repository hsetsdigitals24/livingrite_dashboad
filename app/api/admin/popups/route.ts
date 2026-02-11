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

    const popup = await prisma.landingPagePopup.findFirst();

    return NextResponse.json(popup);
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
    } = body;

    // Validate required fields
    if (!title || !actionButtonText || !actionButtonUrl) {
      return NextResponse.json(
        { error: "Missing required fields: title, actionButtonText, actionButtonUrl" },
        { status: 400 }
      );
    }

    // Check if popup already exists and delete it
    const existingPopup = await prisma.landingPagePopup.findFirst();
    if (existingPopup) {
      await prisma.landingPagePopup.delete({
        where: { id: existingPopup.id },
      });
    }

    const popup = await prisma.landingPagePopup.create({
      data: {
        title,
        description,
        imageUrl,
        imageAlt,
        actionButtonText,
        actionButtonUrl,
        isActive: isActive ?? true,
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
