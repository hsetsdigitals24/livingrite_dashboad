import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const paymentReference = searchParams.get('paymentReference');
    const calcomId = searchParams.get('calcomId');
    const clientEmail = searchParams.get('clientEmail');

    let booking;

    if (paymentReference) {
      booking = await prisma.booking.findUnique({
        where: { paymentReference },
      });
    } else if (calcomId) {
      booking = await prisma.booking.findUnique({
        where: { calcomId },
      });
    } else if (clientEmail) {
      booking = await prisma.booking.findFirst({
        where: { clientEmail },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      return NextResponse.json(
        { error: 'Please provide a search parameter: paymentReference, calcomId, or clientEmail' },
        { status: 400 }
      );
    }

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}
