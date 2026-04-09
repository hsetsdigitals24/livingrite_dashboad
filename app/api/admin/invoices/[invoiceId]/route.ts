import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/email";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { invoiceId } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: true,
        patient: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Access control: Admin can see all, Client can see own invoices
    if (session.user.role === "CLIENT") {
      if (invoice.clientId !== session.user.id) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    } else if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ data: invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { invoiceId } = await params;
    const { status, markedPaidAt } = await request.json();

    if (!["DRAFT", "GENERATED", "SENT", "VIEWED", "PAID", "OVERDUE", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid invoice status" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
        ...(status === "PAID" && {
          paidAt: markedPaidAt ? new Date(markedPaidAt) : new Date(),
          markedPaidBy: session.user.id,
          markedPaidAt: new Date(),
        }),
      },
      include: {
        client: true,
        patient: true,
      },
    });

    return NextResponse.json({ data: invoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { invoiceId } = await params;
    const { action } = await request.json();

    if (action !== "send") {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: true,
        patient: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Get admin settings for payment details
    const adminSettings = await prisma.adminSettings.findFirst();

    // Send email to client with payment details
    try {
      await sendInvoiceEmail(invoice, adminSettings);

      // Update invoice status to SENT
      const updatedInvoice = await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: "SENT",
          sentAt: new Date(),
        },
      });

      return NextResponse.json({ data: updatedInvoice });
    } catch (emailError) {
      console.error("Error sending invoice email:", emailError);
      return NextResponse.json(
        { error: "Failed to send invoice email", details: emailError instanceof Error ? emailError.message : "Unknown error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing invoice action:", error);
    return NextResponse.json(
      { error: "Failed to process invoice action" },
      { status: 500 }
    );
  }
}
