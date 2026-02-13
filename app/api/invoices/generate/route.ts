import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingId, serviceId, customAmount } = await request.json();

    console.log("Invoice generation request:", { bookingId, serviceId, customAmount });

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Fetch booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true, user: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify user owns this booking
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Check if invoice already exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { bookingId },
    });

    if (existingInvoice) {
      return NextResponse.json(existingInvoice);
    }

    // Determine amount
    let amount = customAmount || 0;
    let currency = "NGN";

    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (service && service.basePrice) {
        amount = service.basePrice;
        currency = service.currency || "NGN";
      }
    }

    // Generate invoice number: INV-YYYY-MM-DD-XXXXX
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(5, "0");
    const invoiceNumber = `INV-${year}-${month}-${day}-${random}`;

    // Calculate due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        bookingId,
        invoiceNumber,
        amount,
        totalAmount: amount,
        currency,
        status: "SENT",
        dueAt: dueDate,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
