import sgMail from '@sendgrid/mail';
import { Booking } from '@prisma/client';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendConfirmationEmail(booking: Booking) {
  const msg = {
    to: booking.clientEmail,
    from: process.env.SENDGRID_FROM_EMAIL!,
    templateId: 'd-xxxxx', // Create template in SendGrid
    dynamicTemplateData: {
      clientName: booking.clientName,
      scheduledAt: booking.scheduledAt.toLocaleString('en-US', {
        timeZone: booking.clientTimezone,
      }),
      timezone: booking.clientTimezone,
      calendarLink: booking.calendlyEventUri,
      whatToExpect: [
        'Please join 5 minutes early',
        'Have your questions ready',
        'Ensure stable internet connection',
      ],
    },
  };

  await sgMail.send(msg);
}

export async function sendReminderEmail(booking: Booking, hoursAhead: number) {
  const msg = {
    to: booking.clientEmail,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Reminder: Your consultation is in ${hoursAhead} hours`,
    html: `
      <h2>Hi ${booking.clientName},</h2>
      <p>This is a friendly reminder that your consultation is scheduled for:</p>
      <p><strong>${booking.scheduledAt.toLocaleString('en-US', {
        timeZone: booking.clientTimezone,
      })}</strong></p>
      <p>Join link: ${booking.calendlyEventUri}</p>
      <p>Need to reschedule? <a href="${booking.calendlyEventUri}/reschedule">Click here</a></p>
    `,
  };

  await sgMail.send(msg);
}

export async function sendThankYouEmail(booking: Booking) {
  const msg = {
    to: booking.clientEmail,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Thank you for your consultation',
    html: `
      <h2>Thank you, ${booking.clientName}!</h2>
      <p>We hope you found our consultation valuable.</p>
      <p>We'd love to hear your feedback:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/feedback?booking=${booking.id}">
        Share Your Feedback
      </a>
    `,
  };

  await sgMail.send(msg);
}

export async function sendFollowUpEmail(booking: Booking) {
  const msg = {
    to: booking.clientEmail,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: "We're here if you need us",
    html: `
      <h2>Hi ${booking.clientName},</h2>
      <p>We noticed we haven't heard from you since your consultation.</p>
      <p>If you have any questions or need further assistance, please don't hesitate to reach out.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/booking">Schedule another consultation</a></p>
    `,
  };

  await sgMail.send(msg);
}