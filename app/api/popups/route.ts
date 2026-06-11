import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Dynamic so admin toggles/edits surface on the landing page immediately. The
// query is a single indexed findFirst — cheap enough to run per request.
export const dynamic = 'force-dynamic';

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
