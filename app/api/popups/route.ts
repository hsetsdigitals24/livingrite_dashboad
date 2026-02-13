import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 300; // ISR: revalidate every 5 minutes

export async function GET() {
  try {
    // Fetch the first active popup ordered by displayOrder
    const popup = await prisma.landingPagePopup.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json({ popup }, { status: 200 });
  } catch (error) {
    console.error('Error fetching popup:', error);
    return NextResponse.json({ popup: null, error: 'Failed to fetch popup' }, { status: 500 });
  }
}
