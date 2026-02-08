import { sendConfirmationEmail } from "@/lib/email"; 
import { prisma } from "@/lib/prisma";

export async function handleBookingCreated(payload: any) {
  const bookingData = payload.payload;
console.log("Booking Data:", bookingData);
  const {
    eventId: eventId,
    startTime,
    attendee,
    responses,
    timeZone,
    eventTypeId,
  } = bookingData;

  const email = attendee?.email;
  const fullName = attendee?.name;
  const phone = responses?.phone || null;
  const intakeForm = responses || {};
  const location = responses?.location || null;
  const hours = responses?.hours ? Number(responses.hours) : null;
  const sessions = responses?.sessions ? Number(responses.sessions) : null;
  const isDiaspora = timeZone && !timeZone.includes("Africa");

  
  const serviceMapping = await prisma.service.findFirst({
    where: { slug: eventTypeId },  
  });

  const serviceId = serviceMapping?.id || null;

  // 1️⃣ Upsert user
  const user = await prisma.user.upsert({
    where: { email },
    update: { name: fullName, phone },
    create: {
      email,
      name: fullName,
      phone,
      role: "CLIENT",
    },
  });

  const clientProfile = await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      timezone: timeZone,
    },
  });
 

  // 2️⃣ Create booking
  const booking = await prisma.booking.create({
    data: {
      calcomId: eventId,
      userId: user.id,
      serviceId,
      clientEmail: email,
      clientName: fullName,
      clientPhone: phone, 
      scheduledAt: bookingData.startTime ? new Date(bookingData.startTime) : new Date(), 
      id: bookingData.eventId || null,
      timezone: bookingData.timeZone || null,
      meetingUri: bookingData.metadata?.videoCallUrl || null,
      status: "SCHEDULED",
    },
  });

  // 3️⃣ Calculate price 
  if (serviceId) {
    // Check if this is the client's first booking
    const previousBookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
        status: { in: ["COMPLETED", "SCHEDULED"] },
        createdAt: { lt: booking.createdAt }, // Only previous bookings
      },
    });

    const isFirstConsultation = previousBookings.length === 0;
 

  // 4️⃣ Create invoice
  await prisma.invoice.create({
    data: { 
      bookingId: booking.id, 
      amount: 0,
      currency: "USD",
      status: "PENDING",
    },
  });

  // 5️⃣ Create reminders
  const reminderTimes = [
    { hoursBefore: 12 },
    { hoursBefore: 6 },
  ];

  for (const reminder of reminderTimes) {
    await prisma.reminder.create({
      data: {
        bookingId: booking.id,
        type: "EMAIL",
        scheduledAt: new Date(
          new Date(startTime).getTime() - reminder.hoursBefore * 60 * 60 * 1000
        ),
        status: "PENDING",
      },
    });
  }

  sendConfirmationEmail(booking);
}
}
