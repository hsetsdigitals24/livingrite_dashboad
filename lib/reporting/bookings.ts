import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface BookingMetrics {
  totalBooked: number;
  totalCompleted: number;
  totalCancelled: number;
  completionRate: number;
  noShowRate: number;
  rescheduledCount: number;
  averageBookingValue: number;
  conversionToPaymentRate: number;
}

/**
 * Get count of consultations booked in timeframe
 */
export async function getConsultationsBooked(
  startDate: Date,
  endDate: Date
): Promise<number> {
  return await prisma.booking.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

/**
 * Get count of consultations completed (status: COMPLETED)
 */
export async function getConsultationsCompleted(
  startDate: Date,
  endDate: Date
): Promise<number> {
  return await prisma.booking.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'COMPLETED',
    },
  });
}

/**
 * Get count of cancelled consultations
 */
export async function getConsultationsCancelled(
  startDate: Date,
  endDate: Date
): Promise<number> {
  return await prisma.booking.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'CANCELLED',
    },
  });
}

/**
 * Get no-show rate (bookings that were NO_SHOW)
 */
export async function getNoShowCount(
  startDate: Date,
  endDate: Date
): Promise<number> {
  return await prisma.booking.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'NO_SHOW',
    },
  });
}

/**
 * Get rescheduled bookings count
 */
export async function getRescheduledCount(
  startDate: Date,
  endDate: Date
): Promise<number> {
  return await prisma.booking.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'RESCHEDULED',
    },
  });
}

/**
 * Get average booking/consultation value
 */
export async function getAverageBookingValue(
  startDate: Date,
  endDate: Date
): Promise<number> {
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      payment: true,
    },
  });

  if (bookings.length === 0) return 0;

  const totalValue = bookings.reduce((sum, booking) => {
    return sum + (booking.payment?.amount || 0);
  }, 0);

  return totalValue / bookings.length;
}

/**
 * Get conversion rate from booking to payment
 */
export async function getBookingToPaymentConversionRate(
  startDate: Date,
  endDate: Date
): Promise<number> {
  const totalBookings = await prisma.booking.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  if (totalBookings === 0) return 0;

  const paidBookings = await prisma.booking.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      payment: {
        status: 'PAID',
      },
    },
  });

  return (paidBookings / totalBookings) * 100;
}

/**
 * Get comprehensive booking metrics
 */
export async function getBookingMetrics(
  startDate: Date,
  endDate: Date
): Promise<BookingMetrics> {
  const totalBooked = await getConsultationsBooked(startDate, endDate);
  const totalCompleted = await getConsultationsCompleted(startDate, endDate);
  const totalCancelled = await getConsultationsCancelled(startDate, endDate);
  const noShowCount = await getNoShowCount(startDate, endDate);
  const rescheduledCount = await getRescheduledCount(startDate, endDate);
  const averageBookingValue = await getAverageBookingValue(startDate, endDate);
  const conversionToPaymentRate = await getBookingToPaymentConversionRate(
    startDate,
    endDate
  );

  return {
    totalBooked,
    totalCompleted,
    totalCancelled,
    completionRate: totalBooked > 0 ? (totalCompleted / totalBooked) * 100 : 0,
    noShowRate: totalBooked > 0 ? (noShowCount / totalBooked) * 100 : 0,
    rescheduledCount,
    averageBookingValue,
    conversionToPaymentRate,
  };
}

/**
 * Get booking trends over time (daily/weekly/monthly breakdown)
 */
export async function getBookingTrends(
  startDate: Date,
  endDate: Date,
  groupBy: 'day' | 'week' | 'month' = 'week'
): Promise<{ date: string; booked: number; completed: number; cancelled: number }[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const trendMap = new Map<string, { booked: number; completed: number; cancelled: number }>();

  bookings.forEach((booking) => {
    let dateKey: string;
    const date = booking.createdAt;

    if (groupBy === 'day') {
      dateKey = date.toISOString().split('T')[0];
    } else if (groupBy === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      dateKey = weekStart.toISOString().split('T')[0];
    } else {
      // month
      dateKey = date.toISOString().slice(0, 7);
    }

    if (!trendMap.has(dateKey)) {
      trendMap.set(dateKey, { booked: 0, completed: 0, cancelled: 0 });
    }

    const trend = trendMap.get(dateKey)!;
    trend.booked++;

    if (booking.status === 'COMPLETED') {
      trend.completed++;
    } else if (booking.status === 'CANCELLED') {
      trend.cancelled++;
    }
  });

  return Array.from(trendMap.entries())
    .map(([date, metrics]) => ({
      date,
      ...metrics,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
