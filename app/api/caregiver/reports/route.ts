import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


export async function POST() {
  // Progress report persistence is not implemented. No ProgressReport/CareNote
  // model exists in the schema, and the previous handler discarded submissions
  // while reporting success — masking the fact that nothing was saved.
  return NextResponse.json(
    { error: 'Progress report submission is not implemented yet' },
    { status: 501 }
  );
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user?.role !== 'CAREGIVER' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized - Caregiver access required' },
        { status: 403 }
      );
    }

    // Get all bookings for the caregiver's clients
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ['SCHEDULED', 'COMPLETED'],
        },
      },
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        scheduledAt: true,
        status: true,
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}
