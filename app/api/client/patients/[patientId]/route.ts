import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id || session.user?.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify client has access to this patient
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
        { error: "Access denied to this patient" },
        { status: 403 }
      );
    }

    // Get detailed patient information
    const patient = await prisma.patient.findUnique({
      where: { id: params.patientId },
      include: {
        vitals: {
          orderBy: { recordedAt: "desc" },
        },
        dailyLogs: {
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
        },
        labResults: {
          orderBy: { date: "desc" },
        },
        medicalAppointments: {
          orderBy: { date: "desc" },
        },
        bookings: {
          orderBy: { scheduledAt: "desc" },
          include: {
            payment: true,
            service: true,
          },
        },
        files: {
          orderBy: { createdAt: "desc" },
        },
        familyMembers: true,
        caregivers: {
          include: {
            caregiver: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { patientId } = await params;

    // Verify user has access to this patient
    const familyMember = await prisma.familyMemberAssignment.findUnique({
      where: {
        patientId_clientId: {
          patientId,
          clientId: session.user.id,
        },
      },
    });

    if (!familyMember) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const data = await req.json();

    // Update patient
    const patient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        biologicalGender: data.biologicalGender,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        timezone: data.timezone,
        medicalConditions: data.medicalConditions,
        medications: data.medications,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
      },
    });

    return NextResponse.json(patient, { status: 200 });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    );
  }
}
