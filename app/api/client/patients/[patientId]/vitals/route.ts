import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id || session.user?.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify access to this patient
    const access = await prisma.familyMemberAssignment.findUnique({
      where: {
        patientId_clientId: {
          patientId: params.patientId,
          clientId: session.user.id,
        },
      },
    });

    if (!access || access.accessLevel === "VIEW") {
      return NextResponse.json(
        { error: "You do not have permission to add records to this patient" },
        { status: 403 }
      );
    }

    const { temperature, bloodPressure, heartRate } = await request.json();

    if (!temperature || !bloodPressure || !heartRate) {
      return NextResponse.json(
        { error: "Temperature, blood pressure, and heart rate are required" },
        { status: 400 }
      );
    }

    const vital = await prisma.vitals.create({
      data: {
        patientId: params.patientId,
        temperature: parseFloat(temperature),
        bloodPressure,
        heartRate: parseInt(heartRate),
      },
    });

    return NextResponse.json(vital, { status: 201 });
  } catch (error) {
    console.error("Error creating vital record:", error);
    return NextResponse.json(
      { error: "Failed to create vital record" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id || session.user?.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify access to this patient
    const access = await prisma.familyMemberAssignment.findUnique({
      where: {
        patientId_clientId: {
          patientId: params.patientId,
          clientId: session.user.id,
        },
      },
    });

    if (!access) {
      return NextResponse.json(
        { error: "You do not have access to this patient's records" },
        { status: 403 }
      );
    }

    const vitals = await prisma.vitals.findMany({
      where: { patientId: params.patientId },
      orderBy: { recordedAt: "desc" },
    });

    return NextResponse.json(vitals);
  } catch (error) {
    console.error("Error fetching vital records:", error);
    return NextResponse.json(
      { error: "Failed to fetch vital records" },
      { status: 500 }
    );
  }
}
