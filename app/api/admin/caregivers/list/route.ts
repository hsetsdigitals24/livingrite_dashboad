import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all caregivers
    const caregivers = await prisma.user.findMany({
      where: { role: 'CAREGIVER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        caregiverProfile: {
          select: {
            specialization: true,
            yearsOfExperience: true,
            licenseNumber: true,
            bio: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: caregivers });
  } catch (error) {
    console.error('Error fetching caregivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch caregivers' },
      { status: 500 }
    );
  }
}
