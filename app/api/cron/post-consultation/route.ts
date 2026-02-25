import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  sendPostConsultationThankYou,
  getPostConsultationThankYouSMS,
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
    // Find bookings that ended between 30 minutes and 2 hours ago
    // This ensures thank you emails/SMS are sent after consultation ends
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    const bookingsForThankYou = await prisma.booking.findMany({
      where: {
        scheduledAt: {
          lte: twoHoursAgo,
          gte: thirtyMinutesAgo,
        },
        thankYouSent: false,
        thankYouSmsSent: false,
        status: 'SCHEDULED',
        cancelledAt: null,
      },
    });

    const results = {
      emailSuccess: 0,
      emailFailed: 0,
      smsSuccess: 0,
      smsFailed: 0,
      statusUpdated: 0,
      errors: [] as Array<{ bookingId: string; error: string }>,
    };

    for (const booking of bookingsForThankYou) {
      try {
        // Send thank you email
        try {
          await sendPostConsultationThankYou(booking);
          await prisma.booking.update({
            where: { id: booking.id },
            data: { thankYouSent: true },
          });
          results.emailSuccess++;
        } catch (emailError) {
          const errorMsg = emailError instanceof Error ? emailError.message : 'Unknown error';
          results.emailFailed++;
          results.errors.push({ bookingId: booking.id, error: `Email: ${errorMsg}` });
        }

        // Send thank you SMS
        if (booking.clientPhone) {
          const feedbackLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/feedback?booking=${booking.id}`;
          const smsBody = getPostConsultationThankYouSMS(booking.clientName, feedbackLink);
          const smsResult = await sendSMSWithRetry({ to: booking.clientPhone, body: smsBody });

          if (smsResult.success) {
            await prisma.booking.update({
              where: { id: booking.id },
              data: { thankYouSmsSent: true },
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

        // Update booking status to COMPLETED
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: 'COMPLETED' },
        });
        results.statusUpdated++;

        // Create Reminder record for tracking
        await prisma.reminder.create({
          data: {
            bookingId: booking.id,
            type: 'thank-you',
            scheduledAt: new Date(booking.scheduledAt.getTime() + 1 * 60 * 60 * 1000), // 1 hour after consultation
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
      processed: bookingsForThankYou.length,
      results,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Post-consultation thank you cron job failed:', errorMsg);
    return NextResponse.json(
      { error: 'Cron job failed', details: errorMsg },
      { status: 500 }
    );
  }
}
