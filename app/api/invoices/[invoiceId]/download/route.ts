import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { invoiceId } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: { select: { id: true, name: true, email: true } },
        booking: {
          select: { id: true, clientName: true, clientEmail: true, userId: true, scheduledAt: true },
        },
        service: { select: { title: true } },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Access control: admins see all; clients only see their own
    if (session.user.role !== "ADMIN") {
      const isOwner =
        invoice.clientId === session.user.id ||
        invoice.booking?.userId === session.user.id;
      if (!isOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const clientName  = invoice.client?.name  || invoice.booking?.clientName  || "Client";
    const clientEmail = invoice.client?.email || invoice.booking?.clientEmail || "";

    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      clientName,
      clientEmail,
      services: (invoice as any).services || (invoice.service ? [{ title: invoice.service.title, amount: invoice.amount }] : []),
      amount: invoice.amount,
      tax: invoice.tax,
      discount: invoice.discount,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency,
      status: invoice.status,
      notes: (invoice as any).notes,
      createdAt: invoice.createdAt,
      dueAt: invoice.dueAt,
      paidAt: invoice.paidAt,
    };

    return NextResponse.json(invoiceData);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return NextResponse.json({ error: "Failed to download invoice" }, { status: 500 });
  }
}
