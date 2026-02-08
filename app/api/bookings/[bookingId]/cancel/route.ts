import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendCancellationEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params;

    // Find the booking by calcomId or internal id
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { calcomId: bookingId },
          { id: bookingId },
        ],
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // External cancellation handled via webhook from Cal.com/booking provider.
    // If you need to call Cal.com API to cancel, implement that here and use
    // `process.env.CALCOM_API_KEY` and the Cal.com cancellation endpoint.

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    // Send cancellation confirmation email
    try {
      await sendCancellationEmail(updatedBooking);
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Continue with response even if email fails
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
