import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params;

    // Find the booking by calcomId or internal id
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { calcomId: eventId },
          { id: eventId },
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
    await sendCancellationEmail(updatedBooking);

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

async function sendCancellationEmail(booking: any) {
  // Import your email service
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: booking.clientEmail,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Booking Cancellation Confirmation',
    html: `
      <h2>Hi ${booking.clientName},</h2>
      <p>Your booking scheduled for ${new Date(booking.scheduledAt).toLocaleString()} has been cancelled.</p>
      <p>If you'd like to reschedule, please visit our booking page.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/booking">Book a new consultation</a></p>
    `,
  };

  await sgMail.send(msg);
}