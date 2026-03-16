import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/bookings/list
 * Get list of bookings for admin to select from (e.g., for generating invoices)
 * Supports filtering by invoiceStatus: "no-invoice" to show only bookings without invoices
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can access this endpoint
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can access this endpoint' },
        { status: 403 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const invoiceStatus = searchParams.get('invoiceStatus');

    const where: any = {};

    // Filter bookings without invoices
    if (invoiceStatus === 'no-invoice') {
      where.invoice = null;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            title: true,
            basePrice: true,
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            currency: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      bookings: bookings.map((booking) => ({
        id: booking.id,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        service: booking.service,
        payment: booking.payment,
      })),
    });
  } catch (error) {
    console.error('Error fetching bookings list:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to fetch bookings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
