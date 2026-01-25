import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  sendReminderEmail, 
  sendThankYouEmail, 
  sendFollowUpEmail 
} from '@/lib/email';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  // 1. Send 6-hour reminders
  const sixHoursFromNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);
  const bookingsFor6HourReminder = await prisma.booking.findMany({
    where: {
      scheduledAt: {
        gte: sixHoursFromNow,
        lte: new Date(sixHoursFromNow.getTime() + 15 * 60 * 1000), // 15-min window
      },
      reminderSent: false,
      status: 'SCHEDULED',
    },
  });

  for (const booking of bookingsFor6HourReminder) {
    await sendReminderEmail(booking, 6);
    await prisma.booking.update({
      where: { id: booking.id },
      data: { reminderSent: true },
    });
  }

  // 2. Send thank you emails (1 hour after consultation)
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const bookingsForThankYou = await prisma.booking.findMany({
    where: {
      scheduledAt: {
        lte: oneHourAgo,
      },
      thankYouSent: false,
      status: 'SCHEDULED',
    },
  });

  for (const booking of bookingsForThankYou) {
    await sendThankYouEmail(booking);
    await prisma.booking.update({
      where: { id: booking.id },
      data: { 
        thankYouSent: true,
        status: 'COMPLETED',
      },
    });
  }

  // 3. Send 48-hour follow-ups
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const bookingsForFollowUp = await prisma.booking.findMany({
    where: {
      scheduledAt: {
        lte: fortyEightHoursAgo,
      },
      followUpSent: false,
      thankYouSent: true,
      status: 'COMPLETED',
    },
  });

  for (const booking of bookingsForFollowUp) {
    await sendFollowUpEmail(booking);
    await prisma.booking.update({
      where: { id: booking.id },
      data: { followUpSent: true },
    });
  }

  return NextResponse.json({ 
    success: true,
    processed: {
      reminders: bookingsFor6HourReminder.length,
      thankYous: bookingsForThankYou.length,
      followUps: bookingsForFollowUp.length,
    },
  });
}