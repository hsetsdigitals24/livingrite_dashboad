import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/tickets/[id]
 * Get a single ticket with comments and attachments
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          select: { id: true, name: true, email: true, image: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, image: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true, image: true },
            },
            attachments: true,
          },
          orderBy: { createdAt: "asc" },
        },
        attachments: true,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Check access: customers can only see their own tickets
    if (session.user.role !== "ADMIN" && ticket.customerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tickets/[id]
 * Update ticket status, priority, or assignment (admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can update tickets
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const updateData: any = {};

    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "RESOLVED" && !body.resolutionNotes) {
        return NextResponse.json(
          { error: "Resolution notes required when closing ticket" },
          { status: 400 }
        );
      }
      if (body.status === "RESOLVED") {
        updateData.resolvedAt = new Date();
        updateData.resolutionNotes = body.resolutionNotes;
      }
    }

    if (body.priority !== undefined) {
      updateData.priority = body.priority;
    }

    if (body.category !== undefined) {
      updateData.category = body.category;
    }

    if (body.assignedToId !== undefined) {
      updateData.assignedToId = body.assignedToId;
      updateData.assignedAt = body.assignedToId ? new Date() : null;
    }

    const ticket = await prisma.ticket.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: true,
        assignedTo: true,
        comments: true,
      },
    });

    // TODO: Send email notification on status/assignment change

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tickets/[id]
 * Delete a ticket (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.ticket.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Ticket deleted",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
