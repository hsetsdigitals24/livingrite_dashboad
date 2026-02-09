import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Fetch assigned caregivers for a patient
export async function GET(
  req: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const assignments = await prisma.patientCaregiverAssignment.findMany({
      where: {
        patientId: params.patientId,
        unassignedAt: null,
      },
      include: {
        caregiver: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            caregiverProfile: {
              select: {
                specialization: true,
                yearsOfExperience: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('[PATIENT_CAREGIVERS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Assign caregiver to patient
export async function POST(
  req: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { caregiverId, notes } = body;

    if (!caregiverId) {
      return NextResponse.json(
        { error: 'Caregiver ID is required' },
        { status: 400 }
      );
    }

    // Verify caregiver exists and has CAREGIVER role
    const caregiver = await prisma.user.findFirst({
      where: {
        id: caregiverId,
        role: 'CAREGIVER',
      },
    });

    if (!caregiver) {
      return NextResponse.json(
        { error: 'Invalid caregiver selection' },
        { status: 400 }
      );
    }

    // Check if assignment already exists (unassigned)
    const existingAssignment = await prisma.patientCaregiverAssignment.findUnique({
      where: {
        patientId_caregiverId: {
          patientId: params.patientId,
          caregiverId,
        },
      },
    });

    if (existingAssignment && !existingAssignment.unassignedAt) {
      return NextResponse.json(
        { error: 'Caregiver is already assigned to this patient' },
        { status: 400 }
      );
    }

    // Create or update assignment
    const assignment = await prisma.patientCaregiverAssignment.upsert({
      where: {
        patientId_caregiverId: {
          patientId: params.patientId,
          caregiverId,
        },
      },
      update: {
        unassignedAt: null,
        notes,
        assignedAt: new Date(),
      },
      create: {
        patientId: params.patientId,
        caregiverId,
        notes,
      },
      include: {
        caregiver: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            caregiverProfile: {
              select: {
                specialization: true,
                yearsOfExperience: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('[PATIENT_CAREGIVER_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Unassign caregiver from patient
export async function DELETE(
  req: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const caregiverId = searchParams.get('caregiverId');

    if (!caregiverId) {
      return NextResponse.json(
        { error: 'Caregiver ID is required' },
        { status: 400 }
      );
    }

    await prisma.patientCaregiverAssignment.update({
      where: {
        patientId_caregiverId: {
          patientId: params.patientId,
          caregiverId,
        },
      },
      data: {
        unassignedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PATIENT_CAREGIVER_DELETE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
