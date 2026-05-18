import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const calcomId = searchParams.get('calcomId');
    const clientEmail = searchParams.get('clientEmail');

    // Limit returned fields — callers only need the booking summary, not the
    // full record (intake form JSON, every reminder flag, etc.).
    const bookingSelect = {
      id: true,
      calcomId: true,
      status: true,
      scheduledAt: true,
      timezone: true,
      clientName: true,
      clientEmail: true,
      clientPhone: true,
      eventTitle: true,
      meetingUri: true,
      serviceId: true,
      patientId: true,
      createdAt: true,
    } as const;

    let booking;

    if (calcomId) {
      booking = await prisma.booking.findUnique({
        where: { calcomId },
        select: bookingSelect,
      });
    } else if (clientEmail) {
      booking = await prisma.booking.findFirst({
        where: { clientEmail },
        orderBy: { createdAt: 'desc' },
        select: bookingSelect,
      });
    } else {
      return NextResponse.json(
        { error: 'Please provide a search parameter: calcomId or clientEmail' },
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
