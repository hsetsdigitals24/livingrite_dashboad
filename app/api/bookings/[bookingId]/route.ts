import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
 
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
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { bookingId } = await params;
    const body = await req.json();


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

    // Update booking with provided fields
    const updateData: any = {};

    if (body.intakeForm) {
      updateData.intakeFormData = body.intakeForm;
    }

    if (body.serviceId) {
      updateData.serviceId = body.serviceId;
    }

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