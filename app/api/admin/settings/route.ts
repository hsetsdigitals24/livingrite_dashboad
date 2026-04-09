import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Get or create admin settings (singleton pattern)
    let settings = await prisma.adminSettings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.adminSettings.create({
        data: {
          paymentCurrency: "NGN",
        },
      });
    }

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const {
      paymentAccountName,
      paymentAccountNumber,
      paymentBankName,
      paymentBankCode,
      paymentCurrency,
      paymentInstructions,
    } = body;

    // Get or create admin settings
    let settings = await prisma.adminSettings.findFirst();

    if (settings) {
      settings = await prisma.adminSettings.update({
        where: { id: settings.id },
        data: {
          paymentAccountName,
          paymentAccountNumber,
          paymentBankName,
          paymentBankCode,
          paymentCurrency,
          paymentInstructions,
        },
      });
    } else {
      settings = await prisma.adminSettings.create({
        data: {
          paymentAccountName,
          paymentAccountNumber,
          paymentBankName,
          paymentBankCode,
          paymentCurrency: paymentCurrency || "NGN",
          paymentInstructions,
        },
      });
    }

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error("Error updating admin settings:", error);
    return NextResponse.json(
      { error: "Failed to update admin settings" },
      { status: 500 }
    );
  }
}
