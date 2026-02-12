import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is a CLIENT
    if (session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Only clients can initiate conversations' },
        { status: 403 }
      );
    }

    const { patientId } = params;
    console.log('Fetching caregivers for patientId:', patientId);

    // Verify that the client has access to this patient
    const familyMemberAccess = await prisma.familyMemberAssignment.findUnique({
      where: {
        patientId_clientId: {
          patientId,
          clientId: session.user.id,
        },
      },
    });

    if (!familyMemberAccess) {
      return NextResponse.json(
        { error: 'Access denied to this patient' },
        { status: 403 }
      );
    }

    // Fetch caregivers assigned to this patient
    const caregiverAssignments = await prisma.patientCaregiverAssignment.findMany({
      where: {
        patientId,
        unassignedAt: null, // Only active assignments
      },
      include: {
        caregiver: {
          include: {
            caregiverProfile: true,
          },
        },
      },
    });

    // Map to response format
    const caregivers = caregiverAssignments.map((assignment) => ({
      id: assignment.caregiver.id,
      name: assignment.caregiver.name || 'Unknown',
      specialty: (assignment.caregiver.caregiverProfile?.specialization || []).join(', ') || 'General Care',
      avatar: assignment.caregiver.image,
    }));

    return NextResponse.json(caregivers);
  } catch (error) {
    console.error('Error fetching caregivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch caregivers' },
      { status: 500 }
    );
  }
}
