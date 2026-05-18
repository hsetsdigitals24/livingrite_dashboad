import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireRole, requirePatientAccess } from "@/lib/api-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const auth = await requireRole("CLIENT");
    if (auth.response) return auth.response;
    const { session } = auth;

    const { patientId } = await params;

    const accessDenied = await requirePatientAccess(patientId, session.user.id);
    if (accessDenied) return accessDenied;

    // Get detailed patient information. Limits below cap worst-case payload size —
    // older records are still available via dedicated history endpoints.
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        vitals: {
          orderBy: { recordedAt: "desc" },
          take: 30,
        },
        dailyLogs: {
          orderBy: { date: "desc" },
          take: 14,
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
          take: 20,
        },
        medicalAppointments: {
          orderBy: { date: "desc" },
          take: 20,
        },
        bookings: {
          orderBy: { scheduledAt: "desc" },
          take: 20,
          include: {
            payment: true,
            service: true,
          },
        },
        files: {
          orderBy: { createdAt: "desc" },
          take: 50,
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
