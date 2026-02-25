import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  send48HourFollowUp,
  get48HourFollowUpSMS,
} from '@/lib/email';
import { sendSMSWithRetry } from '@/lib/sms';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  try {
    // Find bookings that ended 47-49 hours ago
    // This ensures we send follow-up if no feedback has been received
    const fortyNineHoursAgo = new Date(now.getTime() - 49 * 60 * 60 * 1000);
    const fortySevenHoursAgo = new Date(now.getTime() - 47 * 60 * 60 * 1000);

    const bookingsForFollowUp = await prisma.booking.findMany({
      where: {
        scheduledAt: {
          lte: fortyNineHoursAgo,
          gte: fortySevenHoursAgo,
        },
        followUpSent: false,
        followUpSmsSent: false,
        thankYouSent: true, // Only follow up if thank you was sent
        status: 'COMPLETED',
        cancelledAt: null,
      },
    });

    const results = {
      emailSuccess: 0,
      emailFailed: 0,
      smsSuccess: 0,
      smsFailed: 0,
      errors: [] as Array<{ bookingId: string; error: string }>,
    };

    for (const booking of bookingsForFollowUp) {
      try {
        // Send follow-up email
        try {
          await send48HourFollowUp(booking);
          await prisma.booking.update({
            where: { id: booking.id },
            data: { followUpSent: true },
          });
          results.emailSuccess++;
        } catch (emailError) {
          const errorMsg = emailError instanceof Error ? emailError.message : 'Unknown error';
          results.emailFailed++;
          results.errors.push({ bookingId: booking.id, error: `Email: ${errorMsg}` });
        }

        // Send follow-up SMS
        if (booking.clientPhone) {
          const smsBody = get48HourFollowUpSMS(booking.clientName);
          const smsResult = await sendSMSWithRetry({ to: booking.clientPhone, body: smsBody });

          if (smsResult.success) {
            await prisma.booking.update({
              where: { id: booking.id },
              data: { followUpSmsSent: true },
            });
            results.smsSuccess++;
          } else {
            results.smsFailed++;
            results.errors.push({
              bookingId: booking.id,
              error: `SMS: ${smsResult.error || 'Unknown error'}`,
            });
          }
        }

        // Create Reminder record for tracking
        await prisma.reminder.create({
          data: {
            bookingId: booking.id,
            type: '48-hour-followup',
            scheduledAt: new Date(booking.scheduledAt.getTime() + 48 * 60 * 60 * 1000), // 48 hours after consultation
            status: results.emailSuccess > 0 || results.smsSuccess > 0 ? 'SENT' : 'FAILED',
            sentVia: results.emailSuccess > 0 && results.smsSuccess > 0 ? 'BOTH' : results.emailSuccess > 0 ? 'EMAIL' : 'SMS',
            sentAt: new Date(),
            errorMessage: results.errors.length > 0 ? results.errors[results.errors.length - 1].error : null,
          },
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push({ bookingId: booking.id, error: errorMsg });
      }
    }

    return NextResponse.json({
      success: true,
      processed: bookingsForFollowUp.length,
      results,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('48-hour follow-up cron job failed:', errorMsg);
    return NextResponse.json(
      { error: 'Cron job failed', details: errorMsg },
      { status: 500 }
    );
  }
}
