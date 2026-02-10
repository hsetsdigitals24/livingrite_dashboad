import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// POST: Create vitals for a patient
export async function POST(
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
    const { temperature, bloodPressure, heartRate } = await req.json();

    // Verify caregiver has access to this patient
    const assignment = await prisma.patientCaregiverAssignment.findFirst({
      where: {
        patientId,
        caregiverId: session.user.id,
        unassignedAt: null,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Patient not assigned to you' },
        { status: 403 }
      );
    }

    // Validate input
    if (!temperature || !bloodPressure || !heartRate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const vital = await prisma.vitals.create({
      data: {
        patientId,
        temperature: parseFloat(temperature),
        bloodPressure,
        heartRate: parseInt(heartRate),
        recordedAt: new Date(),
      },
    });

    return NextResponse.json(vital, { status: 201 });
  } catch (error) {
    console.error('Error creating vital:', error);
    return NextResponse.json(
      { error: 'Failed to create vital' },
      { status: 500 }
    );
  }
}
