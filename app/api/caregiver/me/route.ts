import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'CAREGIVER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
          assignments: {
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
