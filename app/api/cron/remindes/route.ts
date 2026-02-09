import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export const dynamic = 'force-dynamic';  

export async function GET() {
  const now = new Date();

  const reminders = await prisma.reminder.findMany({
    where: {
      scheduledAt: { lte: now },
      status: "PENDING",
    },
    include: {
      booking: {
        include: {
          user: true,
        },
      },
    },
  });

  for (const reminder of reminders) {
    const user = reminder.booking.user;

    // Send email/SMS/WhatsApp here
    // await sendEmail(...)
    // await sendSMS(...)

    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { status: "SENT", updatedAt: new Date() },
    });
  }

  return NextResponse.json({ processed: reminders.length });
}
