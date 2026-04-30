import { prisma } from '@/lib/prisma';


export interface ServiceRevenueMetrics {
  serviceId: string;
  serviceName: string;
  basePrice: number | null;
  actualRevenue: number;
  estimatedRevenue: number;
  revenueVariance: number;
  variancePercentage: number;
  bookingCount: number;
  paidBookingCount: number;
  conversionRate: number;
  profitMargin: number;
}

/**
 * Get estimated and actual revenue by service
 */
export async function getServiceRevenueMetrics(
  startDate: Date,
  endDate: Date
): Promise<ServiceRevenueMetrics[]> {
  const services = await prisma.service.findMany({
    include: {
      bookings: {
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          payment: true,
          proposal: true,
        },
      },
    },
  });

  return services
    .map((service) => {
      const bookings = service.bookings;
      const paidBookings = bookings.filter((b) => b.payment?.status === 'PAID');

      // Actual revenue from paid bookings
      const actualRevenue = paidBookings.reduce((sum, b) => sum + (b.payment?.amount || 0), 0);

      // Estimated revenue from proposals and pending payments
      const estimatedRevenue = bookings.reduce((sum, booking) => {
        if (booking.proposal?.totalAmount) {
          return sum + booking.proposal.totalAmount;
        }
        if (booking.payment?.status === 'PENDING') {
          return sum + booking.payment.amount;
        }
        return sum;
      }, 0);

      const variance = estimatedRevenue - actualRevenue;
      const variancePercentage =
        estimatedRevenue > 0 ? (variance / estimatedRevenue) * 100 : 0;

      return {
        serviceId: service.id,
        serviceName: service.title,
        basePrice: service.basePrice || 0,
        actualRevenue,
        estimatedRevenue,
        revenueVariance: variance,
        variancePercentage,
        bookingCount: bookings.length,
        paidBookingCount: paidBookings.length,
        conversionRate: bookings.length > 0 ? (paidBookings.length / bookings.length) * 100 : 0,
        profitMargin: actualRevenue > 0 ? ((actualRevenue - (service.basePrice || 0) * paidBookings.length) / actualRevenue) * 100 : 0,
      };
    })
    .sort((a, b) => b.actualRevenue - a.actualRevenue);
}

/**
 * Get revenue forecast from pending proposals
 */
export async function getRevenueForcast(daysAhead: number = 30): Promise<{
  forecastedRevenue: number;
  pendingProposalCount: number;
  acceptedProposalCount: number;
  expectedClosureRate: number;
}> {
  const now = new Date();
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  // Get pending proposals (SENT or VIEWED)
  const pendingProposals = await prisma.proposal.findMany({
    where: {
      status: {
        in: ['SENT', 'VIEWED'],
      },
      validUntil: {
        gte: now,
        lte: futureDate,
      },
    },
  });

  // Get accepted proposals in the timeframe
  const acceptedProposals = await prisma.proposal.findMany({
    where: {
      status: 'ACCEPTED',
      acceptedAt: {
        gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        lte: now,
      },
    },
  });

  // Historical closure rate (accepted / sent)
  const allProposalsSent = await prisma.proposal.count({
    where: {
      sentAt: {
        gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const expectedClosureRate =
    allProposalsSent > 0
      ? (acceptedProposals.length / allProposalsSent) * 100
      : 25; // Default 25% if no historical data

  const forecastedRevenue = pendingProposals.reduce((sum, proposal) => {
    const expectedValue = (proposal.totalAmount || 0) * (expectedClosureRate / 100);
    return sum + expectedValue;
  }, 0);

  return {
    forecastedRevenue: Math.round(forecastedRevenue),
    pendingProposalCount: pendingProposals.length,
    acceptedProposalCount: acceptedProposals.length,
    expectedClosureRate: Math.round(expectedClosureRate),
  };
}

/**
 * Get service profitability metrics
 */
export async function getServiceProfitability(
  startDate: Date,
  endDate: Date
): Promise<ServiceRevenueMetrics[]> {
  const metrics = await getServiceRevenueMetrics(startDate, endDate);
  return metrics.filter((m) => m.actualRevenue > 0).sort((a, b) => b.profitMargin - a.profitMargin);
}

/**
 * Get top revenue-generating services
 */
export async function getTopRevenueServices(
  startDate: Date,
  endDate: Date,
  limit: number = 5
): Promise<ServiceRevenueMetrics[]> {
  const metrics = await getServiceRevenueMetrics(startDate, endDate);
  return metrics.slice(0, limit);
}
