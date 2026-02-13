import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const invoiceId = params.invoiceId;

    // Fetch invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        booking: {
          select: {
            id: true,
            clientName: true,
            clientEmail: true,
            userId: true,
            scheduledAt: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Verify user owns this invoice
    if (invoice.booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // For now, return invoice data as JSON
    // In production, you'd generate a PDF here using a library like puppeteer or pdfkit
    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.booking.clientName,
      clientEmail: invoice.booking.clientEmail,
      amount: invoice.amount,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency,
      status: invoice.status,
      createdAt: invoice.createdAt,
      dueAt: invoice.dueAt,
      paidAt: invoice.paidAt,
      scheduledAt: invoice.booking.scheduledAt,
    };

    // TODO: Generate actual PDF file
    // For now, return JSON representation
    return NextResponse.json(invoiceData);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return NextResponse.json(
      { error: "Failed to download invoice" },
      { status: 500 }
    );
  }
}
