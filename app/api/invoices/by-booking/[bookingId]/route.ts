import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/invoices/by-booking/[bookingId]
 * Fetch invoice for a specific booking
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { bookingId } = params;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Fetch invoice for this booking
    const invoice = await prisma.invoice.findUnique({
      where: { bookingId },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found for this booking' },
        { status: 404 }
      );
    }

    // Check authorization - user must own the booking or be admin
    if (session?.user?.id) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { userId: true },
      });

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      // Allow access if user owns booking or is admin
      if (booking.userId !== session.user.id && session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (err) {
    console.error('[API] Error fetching invoice by booking:', err);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}
