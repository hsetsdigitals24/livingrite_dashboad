import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/invoices
 * Get invoices with filtering and pagination
 * Admin can view all, users can only view their own
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    // Non-admin users can only see their own invoices
    if (session.user.role !== 'ADMIN') {
      where.booking = {
        userId: session.user.id,
      };
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          booking: {
            select: {
              id: true,
              clientName: true,
              clientEmail: true,
              scheduledAt: true,
              service: {
                select: {
                  title: true,
                  basePrice: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json(
      {
        invoices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching invoices:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to fetch invoices';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/invoices/generate
 * Generate an invoice for a booking
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

    const { bookingId, amount: adminAmount, tax: adminTax, discount: adminDiscount } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Fetch booking with related data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
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

    // Verify access - admins can generate from any booking, users only from their own
    if (booking.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if invoice already exists
    if (booking.invoice) {
      return NextResponse.json(
        {
          invoice: booking.invoice,
          message: 'Invoice already exists for this booking',
        },
        { status: 200 }
      );
    }

    // Use admin-provided amounts or calculate from booking
    let amount = adminAmount !== undefined ? adminAmount : (booking.payment?.amount || booking.service?.basePrice || 0);
    let tax = adminTax !== undefined ? adminTax : (amount * 0.1); // 10% default tax
    let discount = adminDiscount !== undefined ? adminDiscount : 0;

    // Validate amounts
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (tax < 0 || discount < 0) {
      return NextResponse.json(
        { error: 'Tax and discount cannot be negative' },
        { status: 400 }
      );
    }

    if (discount >= amount) {
      return NextResponse.json(
        { error: 'Discount cannot be equal to or greater than amount' },
        { status: 400 }
      );
    }

    // Generate unique invoice number
    const invoiceNumber = `INV-${new Date().toISOString().split('T')[0]}-${Date.now().toString().slice(-5)}`;

    // Calculate total
    const totalAmount = amount + tax - discount;

    // Create invoice record
    const invoice = await prisma.invoice.create({
      data: {
        bookingId,
        invoiceNumber,
        amount,
        tax,
        discount,
        totalAmount,
        currency: booking.payment?.currency || 'NGN',
        status: 'GENERATED',
        dueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      include: {
        booking: {
          select: {
            clientName: true,
            clientEmail: true,
          },
        },
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error generating invoice:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to generate invoice';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
