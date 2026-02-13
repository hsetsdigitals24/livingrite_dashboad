import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * POST /api/payments/initiate
 * Initiate a payment for a booking using Paystack
 * Returns authorization URL for client redirect
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { bookingId } = await req.json();

    // Validate input
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Fetch booking with invoice details (source of truth for payment amount)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        invoice: true,
        payment: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify user owns the booking
    if (booking.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Verify invoice exists and has amount
    if (!booking.invoice) {
      return NextResponse.json(
        { error: 'Invoice not found for this booking' },
        { status: 400 }
      );
    }

    if (!booking.invoice.totalAmount) {
      return NextResponse.json(
        { error: 'Invoice amount not configured' },
        { status: 400 }
      );
    }

    // Check if payment already exists and is pending/paid
    if (booking.payment) {
      if (
        booking.payment.status === 'PAID' ||
        booking.payment.status === 'PENDING'
      ) {
        return NextResponse.json(
          { error: `Payment already ${booking.payment.status.toLowerCase()}` },
          { status: 400 }
        );
      }
    }

    // Use invoice amount as source of truth
    const amount = booking.invoice.totalAmount;
    const currency = booking.invoice.currency || 'NGN';
    const amountInKobo = Math.round(amount * 100); // Paystack expects amount in kobo (100 kobo = 1 unit)

    // Generate unique payment reference
    const paymentReference = `${booking.id}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    // Create or update payment record
    let payment = booking.payment;

    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          bookingId,
          amount,
          currency: currency,
          status: 'PENDING',
          providerRef: paymentReference,
        },
      });
    } else {
      payment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          amount,
          currency: currency,
          status: 'PENDING',
          providerRef: paymentReference,
        },
      });
    }

    // Create payment attempt record
    await prisma.paymentAttempt.create({
      data: {
        paymentId: payment.id,
        reference: paymentReference,
        amount,
        status: 'pending',
      },
    });

    // Generate Paystack authorization URL
    // In production, you'd call Paystack's API to initialize transaction
    // For now, return the client-side payment initialization data
    const paystackAuthUrl = new URL('https://checkout.paystack.com/');

    return NextResponse.json(
      {
        payment: {
          id: payment.id,
          amount,
          currency: currency,
          reference: paymentReference,
        },
        paystackConfig: {
          publicKey: process.env.PAYSTACK_PUBLIC_KEY,
          email: booking.user.email,
          amount: amountInKobo,
          reference: paymentReference,
          metadata: {
            bookingId,
            invoiceNumber: booking.invoice.invoiceNumber,
            clientName: booking.clientName,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error initiating payment:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to initiate payment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
