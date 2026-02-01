import nodemailer from 'nodemailer';
import { Booking } from '@prisma/client';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendConfirmationEmail(booking: Booking) {
  if (!booking.clientEmail) throw new Error('Client email is required');
  
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'LivingRite Consultations'} <${process.env.SMTP_FROM}>`,
    to: booking.clientEmail,
    replyTo: process.env.SMTP_FROM,
    subject: 'Consultation Confirmation and Payment.',
    html: `
      <h2>Hi ${booking.clientName},</h2>
      <p>Your consultation is confirmed for:</p>
      <p><strong>${booking.scheduledAt.toLocaleString('en-US', { timeZone: booking.clientTimezone })}</strong></p>
      <p>Timezone: ${booking.clientTimezone}</p>
      <p><strong>Important:</strong> Please make your payment to validate your booking. Your schedule will only be valid after payment is received.</p>
      <p>
        <a href="${process.env.NEXTAUTH_URL}/booking/payment?bookingId=${booking.id}" style="display:inline-block;padding:10px 20px;background:#0070f3;color:#fff;text-decoration:none;border-radius:5px;">Pay Now</a>
      </p>
      <p>What to expect:</p>
      <ul>
        <li>Please join 5 minutes early</li>
        <li>Have your questions ready</li>
        <li>Ensure stable internet connection</li>
      </ul>
      <p>A joining link will be sent to you 24 hours before your consultation.</p>
    `,
    text: 'Your consultation is confirmed. Please make your payment to validate your booking. Your schedule will only be valid after payment is received.',
  };

  return await transporter.sendMail(mailOptions);
}

export async function sendReminderEmail(booking: Booking, hoursAhead: number) {
  if (!booking.clientEmail) throw new Error('Client email is required');
  
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'LivingRite Consultations'} <${process.env.SMTP_FROM}>`,
    to: booking.clientEmail,
    replyTo: process.env.SMTP_FROM,
    subject: `Reminder: Your consultation is in ${hoursAhead} hours`,
    html: `
      <h2>Hi ${booking.clientName},</h2>
      <p>This is a friendly reminder that your consultation is scheduled for:</p>
      <p><strong>${booking.scheduledAt.toLocaleString('en-US', { timeZone: booking.clientTimezone })}</strong></p>
      <p>Your Cal.com meeting link will be available in your booking confirmation.</p>
      <p>Need to reschedule? Contact us or check your booking details.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendThankYouEmail(booking: Booking) {
  if (!booking.clientEmail) throw new Error('Client email is required');
  
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'LivingRite Consultations'} <${process.env.SMTP_FROM}>`,
    to: booking.clientEmail,
    replyTo: process.env.SMTP_FROM,
    subject: 'Thank you for your consultation',
    html: `
      <h2>Thank you, ${booking.clientName}!</h2>
      <p>We hope you found our consultation valuable.</p>
      <p>We'd love to hear your feedback:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/feedback?booking=${booking.id}">Share Your Feedback</a>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendFollowUpEmail(booking: Booking) {
  if (!booking.clientEmail) throw new Error('Client email is required');
  
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'LivingRite Consultations'} <${process.env.SMTP_FROM}>`,
    to: booking.clientEmail,
    replyTo: process.env.SMTP_FROM,
    subject: "We're here if you need us",
    html: `
      <h2>Hi ${booking.clientName},</h2>
      <p>We noticed we haven't heard from you since your consultation.</p>
      <p>If you have any questions or need further assistance, please don't hesitate to reach out.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/booking">Schedule another consultation</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
}