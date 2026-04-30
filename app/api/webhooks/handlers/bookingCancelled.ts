import { prisma } from "@/lib/prisma";

export async function handleBookingCancelled(payload: any) {
  const bookingData = payload.payload;

  const { id: calendlyEventId } = bookingData;

  await prisma.booking.updateMany({
    where: { calendlyEventId },
    data: { status: "CANCELLED" },
  });
}
