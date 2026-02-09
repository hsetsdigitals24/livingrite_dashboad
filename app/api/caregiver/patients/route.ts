import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Fetch all patients assigned to the logged-in caregiver with pagination, search, and sorting
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'CAREGIVER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const caregiverId = session.user.id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const skip = (page - 1) * limit;

    // Build search filter
    const searchFilter = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // Fetch patients assigned to this caregiver
    const patients = await prisma.patient.findMany({
      where: {
        ...searchFilter,
        caregivers: {
          some: {
            caregiverId,
            unassignedAt: null, // Only active assignments
          },
        },
      },
      include: {
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
        vitals: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        dailyLogs: {
          orderBy: { date: 'desc' },
          take: 1,
        },
        medicalAppointments: {
          orderBy: { date: 'desc' },
          take: 1,
        },
        bookings: {
          orderBy: { scheduledAt: 'desc' },
          take: 5,
          include: {
            service: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.patient.count({
      where: {
        ...searchFilter,
        caregivers: {
          some: {
            caregiverId,
            unassignedAt: null,
          },
        },
      },
    });

    return NextResponse.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching caregiver patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}
