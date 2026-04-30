import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can access this endpoint' }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const invoiceStatus = searchParams.get('invoiceStatus');

    const where: any = {};
    if (invoiceStatus === 'no-invoice') {
      where.invoice = null;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          select: { id: true, title: true, basePrice: true },
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
        scheduledAt: booking.scheduledAt,
        status: booking.status,
        service: booking.service,
        calcomId: booking.calcomId,
      })),
    });
  } catch (error) {
    console.error('Error fetching bookings list:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
