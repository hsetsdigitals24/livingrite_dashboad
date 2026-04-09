import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { triggerEvent, payload } = body;

    const {
      uid,
      title,
      description,
      additionalNotes,
      startTime,
      attendees,
      metadata,
      customInputs,
    } = payload;

    const attendeeEmail = attendees[0]?.email || null;
    const attendeeName = attendees[0]?.name || null;
    const attendeeTimeZone = attendees?.[0]?.timeZone || null;
    const note = additionalNotes || description || null;

    switch (triggerEvent) {
      case "BOOKING_CREATED":
        await handleBookingCreated({
          uid, title, note, startTime, attendeeEmail, attendeeName,
          metadata, attendeeTimeZone, customInputs,
        });
        break;
      case "BOOKING_CANCELLED":
        await handleBookingCancelled({ uid });
        break;
      case "BOOKING_RESCHEDULED":
        await handleBookingRescheduled({ uid, startTime });
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
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function handleBookingCreated(data: any) {
  const { uid, title, note, startTime, attendeeEmail, attendeeName, attendeeTimeZone, metadata, customInputs } = data;

  if (!uid || !attendeeEmail) {
    console.warn("Cal.com booking missing uid or attendeeEmail, skipping");
    return;
  }

  const scheduledAt = new Date(startTime);

  try {
    // Upsert user by email
    const user = await prisma.user.upsert({
      where: { email: attendeeEmail },
      update: { name: attendeeName },
      create: { email: attendeeEmail, name: attendeeName, role: "CLIENT" },
    });

    // Create/update booking record - payment removed from booking workflow
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

    console.log("Booking created from Cal.com:", booking.id);
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

async function handleBookingCancelled(data: any) {
  const { uid } = data;
  if (!uid) return;
  await prisma.booking.updateMany({
    where: { calcomId: uid },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });
}

async function handleBookingRescheduled(data: any) {
  const { uid, startTime } = data;
  if (!uid) return;
  await prisma.booking.updateMany({
    where: { calcomId: uid },
    data: { scheduledAt: new Date(startTime), status: "RESCHEDULED", rescheduledFrom: uid },
  });
}

async function handleBookingCompleted(data: any) {
  const { uid } = data;
  if (!uid) return;
  await prisma.booking.updateMany({
    where: { calcomId: uid },
    data: { status: "COMPLETED" },
  });
}
