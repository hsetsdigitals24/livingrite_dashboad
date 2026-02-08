import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  console.log("Fetching booking with ID:", params.bookingId);
  try {
    const { bookingId } = params;
 
    const booking = await prisma.booking.findFirst({
      where: {
            OR: [
                { id: bookingId },
                { calcomId: bookingId },
            ],
        },  include: {
          payment: true,
        }
    });
    
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { bookingId } = params;
    const body = await req.json();

    console.log({"id": bookingId, "body": body});

    // Find booking by id or calcomId
    const booking = await prisma.booking.findFirst({
        where: {
            OR: [
                { id: bookingId },
                { calcomId: bookingId },
            ],
        },
        include: {
          payment: true,
        },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if this is an unpaid booking and user already has a free booking
    // const existingFreeBooking = await prisma.booking.findFirst({
    //   where: {
    //     userId: booking.userId,
    //     id: { not: booking.id }, // Exclude current booking
    //     OR: [
    //       { payment: null }, // No payment record (free booking)
    //       { payment: { status: 'PENDING' } }, // Unpaid booking
    //     ],
    //   },
    //   include: {
    //     payment: true,
    //   },
    // });
// console.log({"existingFreeBooking": existingFreeBooking});
    // If trying to create/maintain another free booking, require payment
    // if (existingFreeBooking) {
    //   return NextResponse.json(
    //     { 
    //       error: 'You can only have one free consultation. This booking requires payment.',
    //       code: 'FREE_BOOKING_LIMIT_EXCEEDED',
    //       existingFreeBookingId: existingFreeBooking.id,
    //     },
    //     { status: 403 }
    //   );
    // }

    // Update booking with provided fields
    const updateData: any = {};

    if (body.intakeForm) {
      updateData.intakeFormData = body.intakeForm;
    }

    if (body.serviceId) {
      updateData.serviceId = body.serviceId;
    }

    // if (body.scheduledAt) {
    //   updateData.scheduledAt = new Date(body.scheduledAt);
    // }

    // if (body.amount !== undefined) {
    //   updateData.amount = body.amount;
    // }

    // if (body.status) {
    //   updateData.status = body.status;
    // }

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: updateData,
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}