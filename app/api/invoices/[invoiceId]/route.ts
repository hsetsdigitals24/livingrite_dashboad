import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/invoices/[invoiceId]
 * Get invoice details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { invoiceId } = params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        booking: {
          select: {
            id: true,
            clientName: true,
            clientEmail: true,
            scheduledAt: true,
            userId: true,
            service: {
              select: {
                id: true,
                title: true,
                description: true,
                basePrice: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Verify access
    if (
      invoice.booking.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update status to VIEWED if not already
    if (invoice.status !== 'PAID' && invoice.status !== 'VIEWED') {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'VIEWED' },
      });
      invoice.status = 'VIEWED';
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to fetch invoice';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/invoices/[invoiceId]
 * Update invoice status or mark as sent
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can update invoices' },
        { status: 403 }
      );
    }

    const { invoiceId } = params;
    const { status, action } = await req.json();

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    // Handle status update
    if (status) {
      updateData.status = status;
    }

    // Handle send action
    if (action === 'send') {
      updateData.status = 'SENT';
      updateData.sentAt = new Date();
    }

    // Handle mark as paid
    if (action === 'markPaid') {
      updateData.status = 'PAID';
      updateData.paidAt = new Date();

      // Also update payment status if exists
      const booking = await prisma.booking.findUnique({
        where: { id: invoice.bookingId },
        select: { payment: true },
      });

      if (booking?.payment) {
        await prisma.payment.update({
          where: { id: booking.payment.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
          },
        });
      }
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
      include: {
        booking: {
          select: {
            clientName: true,
            clientEmail: true,
          },
        },
      },
    });

    // TODO: Send email notification if action is 'send'
    if (action === 'send') {
      console.log(
        `[Invoice] Sent invoice ${invoice.invoiceNumber} to ${updatedInvoice.booking.clientEmail}`
      );
    }

    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error) {
    console.error('Error updating invoice:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to update invoice';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
