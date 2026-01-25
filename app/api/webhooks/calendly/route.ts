import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendConfirmationEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { event, payload: eventData } = payload;

    switch (event) {
      case 'invitee.created':
        await handleInviteeCreated(eventData);
        break;
      case 'invitee.canceled':
        await handleInviteeCanceled(eventData);
        break;
      // Add other events as needed
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Calendly webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleInviteeCreated(data: any) {
  const { uri, email, name, timezone, scheduled_event, questions_and_answers } = data;
  
  // Extract intake form data
  const intakeFormData = questions_and_answers?.reduce((acc: any, qa: any) => {
    acc[qa.question] = qa.answer;
    return acc;
  }, {});

  // Create booking record
  const booking = await prisma.booking.create({
    data: {
      calendlyEventId: uri.split('/').pop(),
      calendlyEventUri: uri,
      clientName: name,
      clientEmail: email,
      clientPhone: intakeFormData?.phone || null,
      clientTimezone: timezone,
      scheduledAt: new Date(scheduled_event.start_time),
      duration: (new Date(scheduled_event.end_time).getTime() - 
                 new Date(scheduled_event.start_time).getTime()) / 60000,
      intakeFormData,
      requiresPayment: intakeFormData?.serviceType === 'paid',
    },
  });

  // Send confirmation email
  await sendConfirmationEmail(booking);
  
  // Mark confirmation as sent
  await prisma.booking.update({
    where: { id: booking.id },
    data: { confirmationSent: true },
  });
}

async function handleInviteeCanceled(data: any) {
  const eventId = data.uri.split('/').pop();
  
  await prisma.booking.update({
    where: { calendlyEventId: eventId },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
    },
  });
}