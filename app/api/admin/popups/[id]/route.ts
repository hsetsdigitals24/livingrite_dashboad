import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";

const ALLOWED_FIELDS = [
  "title",
  "description",
  "imageUrl",
  "imageAlt",
  "actionButtonText",
  "actionButtonUrl",
  "isActive",
  "displayOrder",
] as const;

type AllowedField = (typeof ALLOWED_FIELDS)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole("ADMIN");
    if (auth.response) return auth.response;

    const { id } = await params;
    const body = await request.json();

    // Whitelist fields. The previous implementation accepted any body and also
    // ignored the [id] entirely, mutating whichever popup happened to be first
    // in the table.
    const data: Partial<Record<AllowedField, unknown>> = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in body) data[field] = body[field];
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No updatable fields supplied" },
        { status: 400 }
      );
    }

    const popup = await prisma.landingPagePopup.update({
      where: { id },
      data: data as any,
    });

    return NextResponse.json(popup);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Popup not found" }, { status: 404 });
    }
    console.error("Update popup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole("ADMIN");
    if (auth.response) return auth.response;

    const { id } = await params;

    await prisma.landingPagePopup.delete({ where: { id } });

    return NextResponse.json(
      { message: "Popup deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Popup not found" }, { status: 404 });
    }
    console.error("Delete popup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
