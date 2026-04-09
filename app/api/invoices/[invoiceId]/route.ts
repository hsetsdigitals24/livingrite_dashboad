import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { invoiceId } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: { select: { id: true, name: true, email: true } },
        booking: { select: { id: true, clientName: true, clientEmail: true, scheduledAt: true, userId: true } },
        service: { select: { id: true, title: true, basePrice: true } },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Access control: admins see all; clients only see their own
    if (session.user.role !== 'ADMIN') {
      const isOwner =
        invoice.clientId === session.user.id ||
        invoice.booking?.userId === session.user.id;
      if (!isOwner) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Mark as viewed if not yet
    if (invoice.status === 'SENT' || invoice.status === 'GENERATED') {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'VIEWED' },
      });
      invoice.status = 'VIEWED';
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can update invoices' }, { status: 403 });
    }

    const { invoiceId } = await params;
    const { status, action } = await req.json();

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: { select: { name: true, email: true } },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (action === 'send') { updateData.status = 'SENT'; updateData.sentAt = new Date(); }
    if (action === 'markPaid') { updateData.status = 'PAID'; updateData.paidAt = new Date(); }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
      include: {
        client: { select: { id: true, name: true, email: true } },
        booking: { select: { id: true, clientName: true, clientEmail: true } },
      },
    });

    // Send payment confirmation email when marked as paid
    if (action === 'markPaid') {
      try {
        const { sendInvoicePaidNotification } = await import('@/lib/email');
        const clientEmail = updatedInvoice.client?.email || updatedInvoice.booking?.clientEmail;
        const clientName = updatedInvoice.client?.name || updatedInvoice.booking?.clientName || 'Client';
        if (clientEmail) {
          await sendInvoicePaidNotification(
            clientEmail,
            clientName,
            updatedInvoice.invoiceNumber,
            updatedInvoice.amount,
            updatedInvoice.totalAmount,
            updatedInvoice.currency
          );
        }
      } catch (emailError) {
        console.error('Failed to send payment confirmation email:', emailError);
      }
    }

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}
