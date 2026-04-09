import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    // Non-admin users can only see their own invoices
    if (session.user.role !== 'ADMIN') {
      where.clientId = session.user.id;
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          client: { select: { id: true, name: true, email: true } },
          booking: { select: { id: true, clientName: true, clientEmail: true, scheduledAt: true } },
          service: { select: { id: true, title: true, basePrice: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json({
      invoices,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

/**
 * POST /api/invoices
 * Admin generates an invoice for a client.
 * Body: { clientId, services: [{serviceId, title, amount}], amount, tax, discount, notes }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can generate invoices' }, { status: 403 });
    }

    const { clientId, services, amount, tax = 0, discount = 0, notes } = await req.json();

    if (!clientId) {
      return NextResponse.json({ error: 'Client is required' }, { status: 400 });
    }
    if (!services || services.length === 0) {
      return NextResponse.json({ error: 'At least one service is required' }, { status: 400 });
    }
    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    // Verify client exists
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      select: { id: true, name: true, email: true },
    });
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const amountNum = parseFloat(amount);
    const taxNum = parseFloat(tax) || 0;
    const discountNum = parseFloat(discount) || 0;
    const totalAmount = amountNum + taxNum - discountNum;

    // Generate invoice number
    const invoiceNumber = `INV-${new Date().toISOString().split('T')[0]}-${Date.now().toString().slice(-5)}`;
    const dueAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Use first service for legacy serviceId field
    const primaryServiceId = services[0]?.serviceId || null;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId,
        serviceId: primaryServiceId,
        services: services,
        amount: amountNum,
        tax: taxNum,
        discount: discountNum,
        totalAmount,
        currency: 'NGN',
        status: 'SENT',
        sentAt: new Date(),
        dueAt,
        notes: notes || null,
      },
    });

    // Send invoice email with bank account details
    if (client.email) {
      try {
        const paymentSettings = await (prisma as any).paymentSettings.findFirst();
        if (paymentSettings) {
          const { sendInvoiceWithBankDetails } = await import('@/lib/email');
          await sendInvoiceWithBankDetails(
            client.email,
            client.name || client.email,
            invoiceNumber,
            amountNum,
            totalAmount,
            'NGN',
            services.map((s: any) => ({ title: s.title, amount: s.amount })),
            dueAt,
            paymentSettings
          );
        } else {
          console.warn('No payment settings configured — invoice email not sent');
        }
      } catch (emailErr) {
        console.error('Failed to send invoice email:', emailErr);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}
