import { prisma } from "@/lib/prisma";

export async function handleBookingRescheduled(payload: any) {
  const bookingData = payload.payload;

  const {
    id: calendlyEventId,
    startTime,
    timeZone,
  } = bookingData;

  await prisma.booking.updateMany({
    where: { calendlyEventId },
    data: {
      scheduledAt: new Date(startTime),
      timezone: timeZone,
      status: "CONFIRMED",
    },
  });
}
