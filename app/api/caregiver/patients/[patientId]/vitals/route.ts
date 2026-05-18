import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireRole, requireCaregiverAssignment } from '@/lib/api-auth';

// POST: Create vitals for a patient
export async function POST(
  req: Request,
  { params }: { params: Promise<{ patientId: string }>  }
) {
  try {
    const auth = await requireRole('CAREGIVER');
    if (auth.response) return auth.response;
    const { session } = auth;

    const { patientId } = await params;
    const { temperature, bloodPressure, heartRate } = await req.json();

    const accessDenied = await requireCaregiverAssignment(patientId, session.user.id);
    if (accessDenied) return accessDenied;

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
