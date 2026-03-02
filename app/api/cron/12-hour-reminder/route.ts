import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  send12HourPreConsultationReminder,
} from '@/lib/email';
import { sendSMSWithRetry } from '@/lib/sms';
import { get12HourPreConsultationSMS } from '@/lib/sms-templates'; 

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  try {
    // Find bookings scheduled 11.5 to 12.5 hours from now
    // This ensures we catch the 12-hour window and send reminders only once
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const elevenAndHalfHoursFromNow = new Date(now.getTime() + 11.5 * 60 * 60 * 1000);

    const bookingsForReminder = await prisma.booking.findMany({
      where: {
        scheduledAt: {
          gte: elevenAndHalfHoursFromNow,
          lte: twelveHoursFromNow,
        },
        reminderSent: false,
        reminderSmsSent: false,
        status: 'SCHEDULED',
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

    for (const booking of bookingsForReminder) {
      try {
        // Format consultation time for SMS
        const consultationTime = booking.scheduledAt.toLocaleString('en-US', {
          timeZone: booking.timezone || 'UTC',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        // Send email reminder
        try {
          await send12HourPreConsultationReminder(booking);
          await prisma.booking.update({
            where: { id: booking.id },
            data: { reminderSent: true },
          });
          results.emailSuccess++;
        } catch (emailError) {
          const errorMsg = emailError instanceof Error ? emailError.message : 'Unknown error';
          results.emailFailed++;
          results.errors.push({ bookingId: booking.id, error: `Email: ${errorMsg}` });
        }

        // Send SMS reminder
        if (booking.clientPhone) {
          const smsBody = await get12HourPreConsultationSMS(booking.clientName, consultationTime);
          
          // Only send SMS if the reminder is enabled (non-empty template)
          if (smsBody) {
            const smsResult = await sendSMSWithRetry({ to: booking.clientPhone, body: smsBody });

            if (smsResult.success) {
              await prisma.booking.update({
                where: { id: booking.id },
                data: { reminderSmsSent: true },
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
        }

        // Create Reminder record for tracking
        await prisma.reminder.create({
          data: {
            bookingId: booking.id,
            type: '12-hour-pre',
            scheduledAt: booking.scheduledAt,
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
      processed: bookingsForReminder.length,
      results,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('12-hour reminder cron job failed:', errorMsg);
    return NextResponse.json(
      { error: 'Cron job failed', details: errorMsg },
      { status: 500 }
    );
  }
}
