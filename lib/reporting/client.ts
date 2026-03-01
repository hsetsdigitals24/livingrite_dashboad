import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ClientMetrics {
  newClientsCount: number;
  returningClientsCount: number;
  activeClientsCount: number;
  clientLifetimeValue: {
    average: number;
    median: number;
    total: number;
  };
  retentionRate: number;
  churnRate: number;
}

/**
 * Get count of new clients acquired in timeframe
 */
export async function getNewClientsCount(
  startDate: Date,
  endDate: Date
): Promise<number> {
  return await prisma.user.count({
    where: {
      role: 'CLIENT',
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

/**
 * Get returning clients (with multiple bookings)
 */
export async function getReturningClientsCount(
  startDate: Date,
  endDate: Date
): Promise<number> {
  const clients = await prisma.user.findMany({
    where: {
      role: 'CLIENT',
    },
    include: {
      bookings: {
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    },
  });

  return clients.filter((c) => c.bookings.length > 1).length;
}

/**
 * Get active clients (with bookings in last 30 days)
 */
export async function getActiveClientsCount(daysBack: number = 30): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  const activeClients = await prisma.user.findMany({
    where: {
      role: 'CLIENT',
      bookings: {
        some: {
          createdAt: {
            gte: startDate,
          },
        },
      },
    },
  });

  return activeClients.length;
}

/**
 * Get client lifetime value (LTV) metrics
 */
export async function getClientLifetimeValue(): Promise<{
  average: number;
  median: number;
  total: number;
}> {
  const clients = await prisma.user.findMany({
    where: {
      role: 'CLIENT',
      bookings: {
        some: {
          payment: {
            status: 'PAID',
          },
        },
      },
    },
    include: {
      bookings: {
        include: {
          payment: true,
        },
      },
    },
  });

  if (clients.length === 0) {
    return { average: 0, median: 0, total: 0 };
  }

  const clientValues = clients.map((client) => {
    return client.bookings
      .filter((booking) => booking.payment?.status === 'PAID')
      .reduce((sum, booking) => sum + (booking.payment?.amount || 0), 0);
  });

  const total = clientValues.reduce((sum, val) => sum + val, 0);
  const average = total / clients.length;
  const sorted = clientValues.sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  return { average, median, total };
}

/**
 * Get client retention rate (clients from previous period who had bookings in current period)
 */
export async function getClientRetentionRate(
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  previousPeriodStart: Date,
  previousPeriodEnd: Date
): Promise<number> {
  // Clients in previous period
  const previousClients = await prisma.user.findMany({
    where: {
      role: 'CLIENT',
      bookings: {
        some: {
          createdAt: {
            gte: previousPeriodStart,
            lte: previousPeriodEnd,
          },
        },
      },
    },
  });

  if (previousClients.length === 0) return 0;

  // Clients who also booked in current period
  const retainedClients = await prisma.user.count({
    where: {
      id: {
        in: previousClients.map((c) => c.id),
      },
      bookings: {
        some: {
          createdAt: {
            gte: currentPeriodStart,
            lte: currentPeriodEnd,
          },
        },
      },
    },
  });

  return (retainedClients / previousClients.length) * 100;
}

/**
 * Get churn rate (clients from previous period who didn't book in current period)
 */
export async function getClientChurnRate(
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  previousPeriodStart: Date,
  previousPeriodEnd: Date
): Promise<number> {
  const retentionRate = await getClientRetentionRate(
    currentPeriodStart,
    currentPeriodEnd,
    previousPeriodStart,
    previousPeriodEnd
  );
  return 100 - retentionRate;
}

/**
 * Get comprehensive client metrics
 */
export async function getClientMetrics(
  startDate: Date,
  endDate: Date
): Promise<ClientMetrics> {
  const newClientsCount = await getNewClientsCount(startDate, endDate);
  const returningClientsCount = await getReturningClientsCount(startDate, endDate);
  const activeClientsCount = await getActiveClientsCount(30);
  const clientLTV = await getClientLifetimeValue();

  // Calculate retention for the period vs previous period
  const periodLength = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const previousPeriodStart = new Date(startDate.getTime() - periodLength * 24 * 60 * 60 * 1000);
  const previousPeriodEnd = new Date(startDate.getTime());

  const retentionRate = await getClientRetentionRate(
    startDate,
    endDate,
    previousPeriodStart,
    previousPeriodEnd
  );

  return {
    newClientsCount,
    returningClientsCount,
    activeClientsCount,
    clientLifetimeValue: clientLTV,
    retentionRate,
    churnRate: 100 - retentionRate,
  };
}
