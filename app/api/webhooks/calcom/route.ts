import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";
 



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { triggerEvent, payload } = body;

    // console.log("Cal.com webhook event:", triggerEvent);

    // Extract booking data from Cal.com payload
    const {
      uid,
      title,
      description,
      additionalNotes,
      startTime,
      endTime,
      attendees,
      organizer,
      metadata,
      customInputs,
      rescheduleUrl,
      cancellationUrl,
    } = payload;

    const attendeeEmail = attendees[0]?.email || null;
    const attendeeName = attendees[0]?.name || null;
    const attendeeTimeZone = attendees?.[0]?.timeZone || null;
    const note = additionalNotes || description || null;

    // Route events
    switch (triggerEvent) {
      case "BOOKING_CREATED":
        await handleBookingCreated({
          uid,
          title,
          note,
          startTime,
          endTime,
          attendeeEmail,
          attendeeName,
          metadata,
          attendeeTimeZone,
          customInputs,
          rescheduleUrl,
          cancellationUrl,
        });
        break;

      case "BOOKING_CANCELLED":
        await handleBookingCancelled({ uid, payload });
        break;

      case "BOOKING_RESCHEDULED":
        await handleBookingRescheduled({
          uid,
          startTime,
          endTime,
          payload,
        });
        break;

      case "BOOKING_COMPLETED":
        await handleBookingCompleted({ uid });
        break;

      default:
        console.log("Unhandled Cal.com event:", triggerEvent);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Cal.com webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function handleBookingCreated(data: any) {
  const {
    uid,
    title,
    note,
    startTime,
    endTime,
    attendeeEmail,
    attendeeName,
    attendeeTimeZone,
    metadata,
    customInputs,
    rescheduleUrl,
    cancellationUrl,
  } = data;

  if (!uid || !attendeeEmail) {
    console.warn("Cal.com booking missing uid or attendeeEmail, skipping");
    return;
  }

  const scheduledAt = new Date(startTime);
  const endDate = new Date(endTime);
  const duration = (endDate.getTime() - scheduledAt.getTime()) / 60000;

  try {
    // 1️⃣ Upsert user first
    const user = await prisma.user.upsert({
      where: { email: attendeeEmail },
      update: { name: attendeeName },
      create: {
        email: attendeeEmail,
        name: attendeeName,
        role: "CLIENT",
      },
    });

    // 2️⃣ Check if user already has a free booking
    const existingFreeBooking = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        OR: [
          { payment: null },
          { payment: { status: 'FREE' } },
        ],
      },
      include: {
        payment: true,
      },
    });

    if (existingFreeBooking) {
      console.warn(
        `User ${attendeeEmail} already has a free booking (${existingFreeBooking.id}). Creating paid booking instead.`,
      );
      // Create payment record for this booking - user must pay
      const booking = await prisma.booking.upsert({
        where: { calcomId: uid },
        update: {
          clientName: attendeeName || "",
          clientEmail: attendeeEmail || "",
          timezone: attendeeTimeZone || "",
          eventTitle: title || "",
          meetingUri: metadata?.videoCallUrl || "",
          note: note || "",
          scheduledAt, 
          intakeFormData: customInputs || {},
          status: "SCHEDULED",
        },
        create: {
          calcomId: uid,
          userId: user.id,
          clientName: attendeeName || "",
          clientEmail: attendeeEmail || "",
          timezone: attendeeTimeZone || "",
          eventTitle: title || "",
          meetingUri: metadata?.videoCallUrl || "",
          note: note || "",
          scheduledAt, 
          intakeFormData: customInputs || {},
          status: "SCHEDULED",
        },
      });

      // Create payment record
      await prisma.payment.upsert({
        where: { bookingId: booking.id },
        update: { status: 'PENDING' },
        create: {
          bookingId: booking.id,
          amount: 0, // Default amount, can be updated from service pricing
          status: 'PENDING',
        },
      });

      console.log(
        "✓ Created/updated paid booking from Cal.com:",
        booking.id,
        "(calcomId:",
        uid,
        ")",
      );
      return;
    }

    // 3️⃣ Create free booking (first booking)
    const booking = await prisma.booking.upsert({
      where: { calcomId: uid },
      update: {
        clientName: attendeeName || "",
        clientEmail: attendeeEmail || "", 
        eventTitle: title || "",
        meetingUri: metadata?.videoCallUrl || "",
        note: note || "",
        scheduledAt, 
        timezone: attendeeTimeZone || "",
        intakeFormData: customInputs || {},
        status: "SCHEDULED",
      },
      create: {
        calcomId: uid,
        userId: user.id,
        clientName: attendeeName || "",
        clientEmail: attendeeEmail || "",
        timezone: attendeeTimeZone || "",
        eventTitle: title || "",
        meetingUri: metadata?.videoCallUrl || "",
        note: note || "",
        scheduledAt, 
        intakeFormData: customInputs || {},
        status: "SCHEDULED",
      },
    });

       // Create payment record
      await prisma.payment.upsert({
        where: { bookingId: booking.id },
        update: { status: 'PENDING' },
        create: {
          bookingId: booking.id,
          amount: 0, // Default amount, can be updated from service pricing
          status: 'FREE',
        },
      });
    console.log(
      "✓ Created/updated free booking from Cal.com:",
      booking.id,
      "(calcomId:",
      uid,
      ")",
    );

  } catch (error) {
    console.error("Error creating booking from Cal.com:", error);
    throw error;
  }
}

async function handleBookingCancelled(data: any) {
  const { uid, payload } = data;

  if (!uid) {
    console.warn("Cal.com cancellation missing uid, skipping");
    return;
  }

  try {
    const updated = await prisma.booking.updateMany({
      where: { calcomId: uid },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });

  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
}

async function handleBookingRescheduled(data: any) {
  const { uid, startTime, endTime, payload } = data;

  if (!uid) {
    console.warn("Cal.com reschedule missing uid, skipping");
    return;
  }

  try {
    const scheduledAt = new Date(startTime); 

    await prisma.booking.updateMany({
      where: { calcomId: uid },
      data: {
        scheduledAt, 
        status: "RESCHEDULED",
        rescheduledFrom: uid,
      },
    });

  } catch (error) {
    console.error("Error rescheduling booking:", error);
    throw error;
  }
}

async function handleBookingCompleted(data: any) {
  const { uid } = data;

  if (!uid) {
    console.warn("Cal.com completion missing uid, skipping");
    return;
  }

  try {
    await prisma.booking.updateMany({
      where: { calcomId: uid },
      data: { status: "COMPLETED" },
    });

  } catch (error) {
    console.error("Error completing booking:", error);
    throw error;
  }
}
