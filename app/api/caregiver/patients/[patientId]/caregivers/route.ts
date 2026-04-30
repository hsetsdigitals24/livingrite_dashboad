import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Fetch all caregivers assigned to a patient
// Accessible by: caregivers assigned to the patient OR clients with family member access
export async function GET(
  req: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      console.log('[Caregivers API] No session or user ID');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { patientId } = await params;
    const userId = session.user.id;
    const userRole = session.user.role;

    console.log('[Caregivers API] Request from', { userId, userRole, patientId });

    // Verify access based on role
    if (userRole === 'CAREGIVER') {
      // Caregivers: must be assigned to this patient
      const assignment = await prisma.patientCaregiverAssignment.findFirst({
        where: {
          patientId,
          caregiverId: userId,
          unassignedAt: null,
        },
      });

      if (!assignment) {
        console.log('[Caregivers API] Caregiver not assigned to patient');
        return NextResponse.json(
          { error: 'You are not assigned to this patient' },
          { status: 403 }
        );
      }
    } else if (userRole === 'CLIENT') {
      // Clients: must have family member access to this patient
      const familyAccess = await prisma.familyMemberAssignment.findUnique({
        where: {
          patientId_clientId: {
            patientId,
            clientId: userId,
          },
        },
      });

      console.log('[Caregivers API] Family access lookup result:', { found: !!familyAccess, patientId, clientId: userId });

      if (!familyAccess) {
        console.log('[Caregivers API] Client has no family member access to patient');
        return NextResponse.json(
          { error: 'Access denied to this patient' },
          { status: 403 }
        );
      }
    } else {
      console.log('[Caregivers API] Invalid role:', userRole);
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Fetch all active caregivers assigned to this patient
    const caregiverAssignments = await prisma.patientCaregiverAssignment.findMany({
      where: {
        patientId,
        unassignedAt: null,
      },
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
      orderBy: {
        assignedAt: 'asc',
      },
    });

    console.log('[Caregivers API] Found caregivers:', caregiverAssignments.length);

    // Extract caregiver details
    const caregivers = caregiverAssignments
      .map((assignment) => assignment.caregiver)
      .filter((caregiver) => caregiver !== null);

    return NextResponse.json({ caregivers });
  } catch (error) {
    console.error('[Caregivers API] Error fetching assigned caregivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch caregivers', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
