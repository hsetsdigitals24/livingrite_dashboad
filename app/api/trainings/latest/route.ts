import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 3600; // ISR: revalidate every hour

export async function GET() {
  try {
    const training = await prisma.landingPagePopup.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!training) {
      return NextResponse.json(null);
    }

    return NextResponse.json(training);
  } catch (error) {
    console.error('Error fetching latest training:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training' },
      { status: 500 }
    );
  }
}