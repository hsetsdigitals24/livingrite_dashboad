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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const {
      clientId,
      patientId,
      amount,
      servicesData, // Array of {serviceId, title, price}
      tax,
      discount,
      paymentNote,
      dueAt,
    } = await request.json();

    if (!clientId || !amount) {
      return NextResponse.json(
        { error: "Client ID and amount are required" },
        { status: 400 }
      );
    }

    // Verify client exists and is a CLIENT role user
    const client = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!client || client.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Client not found or invalid role" },
        { status: 404 }
      );
    }

    // If patientId provided, verify relationship
    if (patientId) {
      const patientRelation = await prisma.familyMemberAssignment.findUnique({
        where: {
          patientId_clientId: { patientId, clientId },
        },
      });

      if (!patientRelation) {
        return NextResponse.json(
          { error: "Client does not have access to this patient" },
          { status: 403 }
        );
      }
    }

    // Calculate total amount
    const taxAmount = tax || 0;
    const discountAmount = discount || 0;
    const totalAmount = amount + taxAmount - discountAmount;

    // Generate invoice number: INV-YYYY-MM-DD-XXXXX
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(5, "0");
    const invoiceNumber = `INV-${year}-${month}-${day}-${random}`;

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        clientId,
        patientId: patientId || null,
        invoiceNumber,
        amount,
        tax: taxAmount,
        discount: discountAmount,
        totalAmount,
        currency: "NGN",
        status: "GENERATED",
        services: servicesData || null,
        notes: paymentNote || null,
        dueAt: dueAt ? new Date(dueAt) : null,
      },
      include: {
        client: true,
        patient: true,
      },
    });

    return NextResponse.json({ data: invoice }, { status: 201 });
  } catch (error) {
    console.error("Error generating invoice:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        client: true,
        patient: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.invoice.count({ where });

    return NextResponse.json({
      data: invoices,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
