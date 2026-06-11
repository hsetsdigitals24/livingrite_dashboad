import { prisma } from '@/lib/prisma';


export interface AcquisitionSourceMetrics {
  source: string;
  inquiries: number;
  bookings: number;
  paidClients: number;
  revenue: number;
  conversionRate: number;
  revenuePerInquiry: number;
}

/**
 * Get acquisition source breakdown for a timeframe
 */
export async function getAcquisitionSourceBreakdown(
  startDate: Date,
  endDate: Date
): Promise<AcquisitionSourceMetrics[]> {
  // Get all inquiries by source
  const inquiries = await prisma.inquiry.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Get all bookings by source
  const bookings = await prisma.booking.findMany({
    where: {
      inquirySource: {
        not: null,
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      payment: true,
    },
  });

  // Group by source
  const sourceMap = new Map<string, AcquisitionSourceMetrics>();

  // Count inquiries by source
  inquiries.forEach((inquiry) => {
    const source = inquiry.inquirySource || 'Unknown';
    if (!sourceMap.has(source)) {
      sourceMap.set(source, {
        source,
        inquiries: 0,
        bookings: 0,
        paidClients: 0,
        revenue: 0,
        conversionRate: 0,
        revenuePerInquiry: 0,
      });
    }
    const metrics = sourceMap.get(source)!;
    metrics.inquiries++;
  });

  // Count bookings and revenue by source
  bookings.forEach((booking) => {
    const source = booking.inquirySource || 'Unknown';
    if (!sourceMap.has(source)) {
      sourceMap.set(source, {
        source,
        inquiries: 0,
        bookings: 0,
        paidClients: 0,
        revenue: 0,
        conversionRate: 0,
        revenuePerInquiry: 0,
      });
    }
    const metrics = sourceMap.get(source)!;
    metrics.bookings++;

    if (booking.payment?.status === 'PAID') {
      metrics.paidClients++;
      metrics.revenue += booking.payment.amount;
    }
  });

  // Calculate rates
  sourceMap.forEach((metrics) => {
    metrics.conversionRate =
      metrics.inquiries > 0 ? (metrics.bookings / metrics.inquiries) * 100 : 0;
    metrics.revenuePerInquiry =
      metrics.inquiries > 0 ? metrics.revenue / metrics.inquiries : 0;
  });

  return Array.from(sourceMap.values()).sort((a, b) => b.revenue - a.revenue);
}

/**
 * Get top acquisition sources by conversion rate
 */
export async function getTopAcquisitionSources(
  startDate: Date,
  endDate: Date,
  limit: number = 5
): Promise<AcquisitionSourceMetrics[]> {
  const sources = await getAcquisitionSourceBreakdown(startDate, endDate);
  return sources.filter((s) => s.inquiries >= 5).sort((a, b) => b.conversionRate - a.conversionRate).slice(0, limit);
}

/**
 * Get total inquiries by source for a timeframe
 */
export async function getInquiriesBySource(
  startDate: Date,
  endDate: Date
): Promise<{ source: string; count: number }[]> {
  const result = await prisma.inquiry.groupBy({
    by: ['inquirySource'],
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: true,
  });

  return result
    .map((r) => ({
      source: r.inquirySource || 'Unknown',
      count: r._count,
    }))
    .sort((a, b) => b.count - a.count);
}
