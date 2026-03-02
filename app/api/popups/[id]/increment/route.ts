import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const popup = await prisma.landingPagePopup.update({
      where: { id },
      data: {
        popupCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(popup);
  } catch (error) {
    console.error('Error incrementing popup count:', error);
    return NextResponse.json(
      { error: 'Failed to increment popup count' },
      { status: 500 }
    );
  }
}