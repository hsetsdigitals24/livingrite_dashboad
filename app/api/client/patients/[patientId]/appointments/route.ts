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

    const { date, provider, reason, notes, systolic, diastolic, pulse, weightKg, temperatureCelsius } =
      await request.json();

    if (!date || !provider || !reason) {
      return NextResponse.json(
        { error: "Date, provider, and reason are required" },
        { status: 400 }
      );
    }

    const appointment = await prisma.medicalAppointment.create({
      data: {
        patientId: params.patientId,
        date: new Date(date),
        provider,
        reason,
        notes: notes || null,
        systolic: systolic ? parseInt(systolic) : null,
        diastolic: diastolic ? parseInt(diastolic) : null,
        pulse: pulse ? parseInt(pulse) : null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        temperatureCelsius: temperatureCelsius ? parseFloat(temperatureCelsius) : null,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating medical appointment:", error);
    return NextResponse.json(
      { error: "Failed to create medical appointment" },
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

    const appointments = await prisma.medicalAppointment.findMany({
      where: { patientId: params.patientId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching medical appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical appointments" },
      { status: 500 }
    );
  }
}
