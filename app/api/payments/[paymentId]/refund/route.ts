import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/payments/[paymentId]/refund
 * Request a refund for a payment
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can request refunds' },
        { status: 403 }
      );
    }

    const { paymentId } = params;
    const { amount, reason } = await req.json();

    if (!amount || !reason) {
      return NextResponse.json(
        { error: 'Amount and reason are required' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Validate refund amount doesn't exceed payment amount
    if (amount > payment.amount) {
      return NextResponse.json(
        { error: 'Refund amount cannot exceed payment amount' },
        { status: 400 }
      );
    }

    // Create refund request
    const refundRequest = await prisma.refundRequest.create({
      data: {
        paymentId,
        amount,
        reason,
        status: 'PENDING',
      },
    });

    return NextResponse.json(refundRequest, { status: 201 });
  } catch (error) {
    console.error('Error requesting refund:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to request refund';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
