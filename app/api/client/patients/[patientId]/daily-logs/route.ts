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

    const { date } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    // Check if daily log already exists for this date
    const existingLog = await prisma.dailyLog.findUnique({
      where: {
        patientId_date: {
          patientId: params.patientId,
          date: new Date(date),
        },
      },
    });

    if (existingLog) {
      return NextResponse.json(
        { error: "Daily log already exists for this date" },
        { status: 409 }
      );
    }

    const dailyLog = await prisma.dailyLog.create({
      data: {
        patientId: params.patientId,
        date: new Date(date),
      },
    });

    return NextResponse.json(dailyLog, { status: 201 });
  } catch (error) {
    console.error("Error creating daily log:", error);
    return NextResponse.json(
      { error: "Failed to create daily log" },
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

    const logs = await prisma.dailyLog.findMany({
      where: { patientId: params.patientId },
      orderBy: { date: "desc" },
      include: {
        sleepData: true,
        morningVitals: true,
        eveningVitals: true,
        physicalActivity: {
          include: { workouts: true },
        },
        nutritionData: {
          include: { meals: true },
        },
        mentalHealthData: true,
        cognitivePerformance: true,
        environmentalExposure: true,
        womenHealth: true,
        glucoseMonitoring: true,
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching daily logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily logs" },
      { status: 500 }
    );
  }
}
