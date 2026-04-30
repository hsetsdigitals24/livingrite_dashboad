import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Get existing popup
    let popup = await prisma.landingPagePopup.findFirst();

    if (!popup) {
      // Create if doesn't exist
      popup = await prisma.landingPagePopup.create({
        data: body,
      });
    } else {
      // Update existing
      popup = await prisma.landingPagePopup.update({
        where: { id: popup.id },
        data: body,
      });
    }

    return NextResponse.json(popup);
  } catch (error) {
    console.error("Update popup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const popup = await prisma.landingPagePopup.findFirst();

    if (!popup) {
      return NextResponse.json(
        { error: "Popup not found" },
        { status: 404 }
      );
    }

    await prisma.landingPagePopup.delete({
      where: { id: popup.id },
    });

    return NextResponse.json(
      { message: "Popup deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete popup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
