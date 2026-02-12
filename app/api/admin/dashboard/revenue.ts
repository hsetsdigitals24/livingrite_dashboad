import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/dashboard/revenue
 * Get revenue analytics and statistics for the admin dashboard
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all payments with booking and service info
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: {
            service: {
              select: {
                id: true,
                title: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Fetch all invoices
    const invoices = await prisma.invoice.findMany({
      include: {
        booking: true,
      },
    });

    // Calculate totals
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = payments
      .filter((p) => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments
      .filter((p) => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalRefunded = payments
      .filter((p) => p.status === 'REFUNDED')
      .reduce((sum, p) => sum + (p.refundedAmount || 0), 0);

    const successRate =
      payments.length > 0
        ? (payments.filter((p) => p.status === 'PAID').length / payments.length) *
          100
        : 0;

    const averageOrderValue =
      payments.length > 0 ? totalRevenue / payments.length : 0;

    // Revenue by service
    const revenueByService = Array.from(
      payments.reduce((map, p) => {
        const serviceName = p.booking.service?.title || 'Unknown Service';
        const existing = map.get(serviceName) || { revenue: 0, count: 0 };
        return map.set(serviceName, {
          service: serviceName,
          revenue: existing.revenue + p.amount,
          count: existing.count + 1,
        });
      }, new Map<string, any>()).values()
    ).sort((a, b) => b.revenue - a.revenue);

    // Revenue by month (last 12 months)
    const revenueByMonth: Record<string, any> = {};
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
      revenueByMonth[monthKey] = { month: monthKey, revenue: 0, paid: 0, pending: 0 };
    }

    payments.forEach((p) => {
      const date = new Date(p.createdAt);
      const monthKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });

      if (revenueByMonth[monthKey]) {
        revenueByMonth[monthKey].revenue += p.amount;
        if (p.status === 'PAID') {
          revenueByMonth[monthKey].paid += p.amount;
        } else if (p.status === 'PENDING') {
          revenueByMonth[monthKey].pending += p.amount;
        }
      }
    });

    // Top clients
    const clientMap = new Map<
      string,
      {
        name: string;
        email: string;
        totalSpent: number;
        bookingCount: number;
      }
    >();

    payments.forEach((p) => {
      const userId = p.booking.user.id;
      const existing = clientMap.get(userId) || {
        name: p.booking.user.name || 'Unknown',
        email: p.booking.user.email || '',
        totalSpent: 0,
        bookingCount: 0,
      };
      clientMap.set(userId, {
        ...existing,
        totalSpent: existing.totalSpent + (p.status === 'PAID' ? p.amount : 0),
        bookingCount: existing.bookingCount + 1,
      });
    });

    const topClients = Array.from(clientMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return NextResponse.json(
      {
        totalRevenue,
        totalPending,
        totalPaid,
        totalRefunded,
        successRate,
        averageOrderValue,
        invoiceCount: invoices.length,
        paymentCount: payments.length,
        revenueByService,
        revenueByMonth: Object.values(revenueByMonth),
        topClients,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to fetch revenue stats';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
