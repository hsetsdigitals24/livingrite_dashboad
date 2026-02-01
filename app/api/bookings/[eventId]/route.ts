import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params;

    // Try to find booking by calcomId or by id
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
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params;
    const body = await req.json();


    console.log({"id": eventId, "body": body});

    // Find booking by id or calcomId
    const booking = await prisma.booking.findFirst({
        where: {
            OR: [
                { id: eventId },
                { calcomId: eventId },
            ],
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