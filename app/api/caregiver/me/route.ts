import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = await requireRole('CAREGIVER');
    if (auth.response) return auth.response;
    const { session } = auth;

    // Fetch the caregiver user with profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { caregiverProfile: true },
    });

    if (!user || user.role !== 'CAREGIVER') {
      return NextResponse.json(
        { error: 'Caregiver not found' },
        { status: 404 }
      );
    }

    // Count active patients assigned to this caregiver
    const patientCount = await prisma.patientCaregiverAssignment.count({
      where: {
        caregiverId: session.user.id,
        unassignedAt: null,
      },
    });

    // Count total bookings for this caregiver's patients
    const bookingCount = await prisma.booking.count({
      where: {
        patient: {
          caregivers: {
            some: {
              caregiverId: session.user.id,
              unassignedAt: null,
            },
          },
        },
      },
    });

    // Count messages sent by this caregiver
    const messageCount = await prisma.message.count({
      where: {
        senderId: session.user.id,
      },
    });

    const stats = {
      patientCount,
      bookingCount,
      messageCount,
    };

    return NextResponse.json({
      user,
      stats,
    });
  } catch (error) {
    console.error('Error fetching caregiver data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch caregiver data' },
      { status: 500 }
    );
  }
}
