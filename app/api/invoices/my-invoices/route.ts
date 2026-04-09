export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("status"); // "PAID", "SENT", or null for all

    let statusFilter: any = undefined;

    if (filter === "PAID") {
      statusFilter = { status: "PAID" };
    } else if (filter === "SENT") {
      // "unpaid" = anything not paid or cancelled
      statusFilter = { status: { in: ["SENT", "VIEWED", "GENERATED", "OVERDUE"] } };
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        clientId: session.user.id,
        ...statusFilter,
      },
      include: {
        service: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
