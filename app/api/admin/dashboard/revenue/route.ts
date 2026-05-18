import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/dashboard/revenue
 * Revenue analytics driven entirely from invoices (payment model no longer used in workflow)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // All invoices with client + service
    const invoices = await prisma.invoice.findMany({
      include: {
        client: { select: { id: true, name: true, email: true } },
        service: { select: { id: true, title: true } },
        booking: { select: { id: true, clientName: true, clientEmail: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Core totals
    const totalRevenue   = invoices.reduce((s, i) => s + i.totalAmount, 0);
    const totalPaid      = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.totalAmount, 0);
    const totalPending   = invoices.filter(i => ['SENT','VIEWED','GENERATED','OVERDUE'].includes(i.status)).reduce((s, i) => s + i.totalAmount, 0);
    const totalCancelled = invoices.filter(i => i.status === 'CANCELLED').reduce((s, i) => s + i.totalAmount, 0);

    const paidCount   = invoices.filter(i => i.status === 'PAID').length;
    const successRate = invoices.length > 0 ? (paidCount / invoices.length) * 100 : 0;
    const averageOrderValue = invoices.length > 0 ? totalRevenue / invoices.length : 0;

    // Revenue by service (using services JSON array or single service)
    const serviceRevenueMap = new Map<string, { service: string; revenue: number; count: number }>();
    invoices.forEach(inv => {
      const services: any[] = Array.isArray((inv as any).services) && (inv as any).services?.length > 0
        ? (inv as any).services
        : inv.service ? [{ title: inv.service.title, amount: inv.totalAmount }] : [{ title: 'Other', amount: inv.totalAmount }];

      services.forEach((s: any) => {
        const name = s.title || 'Other';
        const existing = serviceRevenueMap.get(name) || { service: name, revenue: 0, count: 0 };
        serviceRevenueMap.set(name, {
          service: name,
          revenue: existing.revenue + (inv.status === 'PAID' ? (s.amount || 0) : 0),
          count: existing.count + 1,
        });
      });
    });
    const revenueByService = Array.from(serviceRevenueMap.values()).sort((a, b) => b.revenue - a.revenue);

    // Revenue by month (last 12 months)
    const revenueByMonth: Record<string, any> = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      revenueByMonth[monthKey] = { month: monthKey, revenue: 0, paid: 0, pending: 0 };
    }

    invoices.forEach(inv => {
      const monthKey = new Date(inv.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (revenueByMonth[monthKey]) {
        revenueByMonth[monthKey].revenue += inv.totalAmount;
        if (inv.status === 'PAID') revenueByMonth[monthKey].paid += inv.totalAmount;
        else if (['SENT','VIEWED','GENERATED'].includes(inv.status)) revenueByMonth[monthKey].pending += inv.totalAmount;
      }
    });

    // Top clients by total invoiced (paid)
    const clientMap = new Map<string, { name: string; email: string; totalSpent: number; invoiceCount: number }>();
    invoices.forEach(inv => {
      const clientId = inv.clientId || inv.booking?.id || 'unknown';
      const clientName  = inv.client?.name  || inv.booking?.clientName  || 'Unknown';
      const clientEmail = inv.client?.email || inv.booking?.clientEmail || '';
      const existing = clientMap.get(clientId) || { name: clientName, email: clientEmail, totalSpent: 0, invoiceCount: 0 };
      clientMap.set(clientId, {
        ...existing,
        totalSpent: existing.totalSpent + (inv.status === 'PAID' ? inv.totalAmount : 0),
        invoiceCount: existing.invoiceCount + 1,
      });
    });
    const topClients = Array.from(clientMap.values()).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10);

    return NextResponse.json({
      totalRevenue,
      totalPaid,
      totalPending,
      totalRefunded: totalCancelled,
      successRate,
      averageOrderValue,
      invoiceCount: invoices.length,
      paymentCount: paidCount,
      revenueByService,
      revenueByMonth: Object.values(revenueByMonth),
      topClients,
    });
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue stats' }, { status: 500 });
  }
}
