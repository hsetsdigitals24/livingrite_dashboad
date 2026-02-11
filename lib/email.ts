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
    subject: 'Consultation Confirmation.',
    html: `
      <h2>Hi ${booking.clientName},</h2>
      <p>Your consultation is confirmed for:</p>
      <p><strong>${booking.scheduledAt.toLocaleString('en-US', { timeZone: booking.timezone  || 'UTC'})}</strong></p>
      <p>Timezone: ${booking.timezone}</p>
    

      <p>What to expect:</p>
      <ul>
        <li>Please join 5 minutes early</li>
        <li>Have your questions ready</li>
        <li>Ensure stable internet connection</li>
      </ul>
      <p>A joining link will be sent to you 24 hours before your consultation.</p>
      <p>Need to reschedule? Contact us or check your booking details.</p>

    `,
    text: 'Your consultation is confirmed. Please make your payment to validate your booking. Your schedule will only be valid after payment is received.',
  };

  return await transporter.sendMail(mailOptions);
}

export async function sendPaymentReminderEmail(booking: Booking) {
  if (!booking.clientEmail) throw new Error('Client email is required');
  
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'LivingRite Consultations'} <${process.env.SMTP_FROM}>`,
    to: booking.clientEmail,
    replyTo: process.env.SMTP_FROM,
    subject: 'Payment Reminder for Your Consultation',
    html: `
      <h2>Hi ${booking.clientName},</h2>
      <p>This is a reminder that your consultation scheduled for <strong>${booking.scheduledAt.toLocaleString('en-US', { timeZone: booking.timezone  || 'UTC'})}</strong> has not been paid for yet.</p>
      <p>Please complete your payment to confirm your booking and secure your spot.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/booking/payment?bookingId=${booking.id}">Complete Payment</a></p>
      <p>If you have any questions or need assistance with payment, please don't hesitate to contact us.</p>
    `,
    text: 'This is a reminder that your consultation has not been paid for yet. Please complete your payment to confirm your booking.',
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
      <p><strong>${booking.scheduledAt.toLocaleString('en-US', { timeZone: booking.timezone  || 'UTC'})}</strong></p>
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

export async function sendCancellationEmail(booking: Booking) {
  if (!booking.clientEmail) throw new Error('Client email is required');
  
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'LivingRite Consultations'} <${process.env.SMTP_FROM}>`,
    to: booking.clientEmail,
    replyTo: process.env.SMTP_FROM,
    subject: 'Booking Cancellation Confirmation',
    html: `
      <h2>Hi ${booking.clientName},</h2>
      <p>Your consultation scheduled for <strong>${booking.scheduledAt.toLocaleString('en-US', { timeZone: booking.timezone  || 'UTC'})}</strong> has been cancelled.</p>
      <p>If you need to reschedule or would like to book another consultation, please feel free to reach out.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/booking">Book a new consultation</a></p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
    `,
    text: 'Your consultation has been cancelled. If you would like to reschedule, please visit our booking page.',
  };

  return await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'LivingRite Consultations'} <${process.env.SMTP_FROM}>`,
    to: email,
    replyTo: process.env.SMTP_FROM,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <p><a href="${resetLink}">Reset Your Password</a></p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `,
    text: `We received a request to reset your password. Use the following link to set a new password: ${resetLink}. If you did not request a password reset, please ignore this email.`,
  };

  return await transporter.sendMail(mailOptions);
}