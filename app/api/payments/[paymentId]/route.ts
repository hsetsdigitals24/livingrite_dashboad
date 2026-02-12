import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/payments/[paymentId]
 * Update payment status (admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can update payments' },
        { status: 403 }
      );
    }

    const { paymentId } = params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['FREE', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
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

    const updateData: any = { status };

    // Set paidAt if marking as paid
    if (status === 'PAID' && !payment.paidAt) {
      updateData.paidAt = new Date();
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
    });

    return NextResponse.json(updatedPayment, { status: 200 });
  } catch (error) {
    console.error('Error updating payment:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to update payment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
