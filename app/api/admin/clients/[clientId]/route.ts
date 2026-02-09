import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Fetch single client details with all associated records
export async function GET(
  req: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { clientId } = params;

    const client = await prisma.user.findUnique({
      where: { id: clientId, role: 'CLIENT' },
      include: {
        familyMemberAssignments: {
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                biologicalGender: true,
                medicalConditions: true,
              },
            },
          },
        },
        bookings: {
          orderBy: { scheduledAt: 'desc' },
          include: {
            service: {
              select: {
                id: true,
                title: true,
                basePrice: true,
                currency: true,
              },
            },
            payment: {
              select: {
                id: true,
                status: true,
                amount: true,
                paidAt: true,
              },
            },
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        accounts: {
          select: {
            provider: true,
            type: true,
          },
        },
        sessions: {
          select: {
            expires: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client details' },
      { status: 500 }
    );
  }
}
