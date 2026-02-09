import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Fetch single patient details for the caregiver
export async function GET(
  req: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'CAREGIVER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { patientId } = params;
    const caregiverId = session.user.id;

    // Verify that the patient is assigned to this caregiver
    const assignment = await prisma.patientCaregiverAssignment.findFirst({
      where: {
        patientId,
        caregiverId,
        unassignedAt: null, // Only active assignments
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Patient not assigned to you' },
        { status: 403 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        vitals: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        dailyLogs: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        labResults: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        medicalAppointments: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        bookings: {
          orderBy: { scheduledAt: 'desc' },
          take: 10,
        },
        caregivers: {
          where: {
            caregiverId,
          },
          select: {
            id: true,
            assignedAt: true,
            notes: true,
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient details' },
      { status: 500 }
    );
  }
}
