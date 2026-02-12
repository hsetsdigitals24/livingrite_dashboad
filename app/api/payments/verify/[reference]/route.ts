import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/payments/verify/[reference]
 * Verify payment status with Paystack
 * Updates local payment record if successful
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { reference } = params;

    // Find payment by reference
    const payment = await prisma.payment.findFirst({
      where: { providerRef: reference },
      include: {
        booking: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    if (
      payment.booking.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Call Paystack API to verify transaction
    const paystackUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    const paystackResponse = await fetch(paystackUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!paystackResponse.ok) {
      // Paystack API error, return current payment status
      return NextResponse.json(
        {
          payment: {
            id: payment.id,
            status: payment.status,
            amount: payment.amount,
            reference,
          },
          verified: false,
        },
        { status: 200 }
      );
    }

    const paystackData = await paystackResponse.json();
    const transaction = paystackData.data;

    // Update payment if transaction is successful
    if (transaction.status === 'success') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          paidAt: new Date(transaction.paid_at),
        },
      });

      return NextResponse.json(
        {
          payment: {
            id: payment.id,
            status: 'PAID',
            amount: payment.amount,
            reference,
            paidAt: transaction.paid_at,
          },
          verified: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount,
          reference,
        },
        verified: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to verify payment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
