import { prisma } from '@/lib/prisma';


export interface ConversionFunnelStage {
  stage: string;
  count: number;
  percentage: number;
  avgTimeToNextStageMs?: number;
}

export interface FullConversionFunnel {
  stages: ConversionFunnelStage[];
  overallConversionRate: number;
  averageTimeToPaymentMs: number;
}

/**
 * Get full conversion funnel: Inquiry → Booking → Proposal → Payment
 */
export async function getConversionFunnel(
  startDate: Date,
  endDate: Date
): Promise<FullConversionFunnel> {
  // Stage 1: Total Inquiries
  const inquiries = await prisma.inquiry.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Stage 2: Qualified Inquiries
  const qualifiedInquiries = await prisma.inquiry.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'QUALIFIED',
    },
  });

  // Stage 3: Bookings Created
  const bookings = await prisma.booking.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Stage 4: Proposals Created
  const proposalsCreated = await prisma.proposal.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Stage 5: Proposals Accepted
  const proposalsAccepted = await prisma.proposal.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'ACCEPTED',
    },
  });

  // Stage 6: Payments Completed
  const paymentsCompleted = await prisma.payment.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'PAID',
    },
  });

  const stages: ConversionFunnelStage[] = [
    {
      stage: 'Inquiries',
      count: inquiries,
      percentage: 100,
    },
    {
      stage: 'Qualified',
      count: qualifiedInquiries,
      percentage: inquiries > 0 ? (qualifiedInquiries / inquiries) * 100 : 0,
    },
    {
      stage: 'Bookings',
      count: bookings,
      percentage: inquiries > 0 ? (bookings / inquiries) * 100 : 0,
    },
    {
      stage: 'Proposals',
      count: proposalsCreated,
      percentage: bookings > 0 ? (proposalsCreated / bookings) * 100 : 0,
    },
    {
      stage: 'Accepted',
      count: proposalsAccepted,
      percentage: proposalsCreated > 0 ? (proposalsAccepted / proposalsCreated) * 100 : 0,
    },
    {
      stage: 'Paid',
      count: paymentsCompleted,
      percentage: proposalsAccepted > 0 ? (paymentsCompleted / proposalsAccepted) * 100 : 0,
    },
  ];

  // Calculate average time to payment
  const paymentTimings = await prisma.booking.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      payment: {
        status: 'PAID',
        paidAt: {
          not: null,
        },
      },
    },
    include: {
      payment: true,
    },
  });

  let averageTimeToPaymentMs = 0;
  if (paymentTimings.length > 0) {
    const totalTime = paymentTimings.reduce((sum, booking) => {
      if (booking.payment?.paidAt) {
        return sum + (booking.payment.paidAt.getTime() - booking.createdAt.getTime());
      }
      return sum;
    }, 0);
    averageTimeToPaymentMs = Math.round(totalTime / paymentTimings.length);
  }

  return {
    stages,
    overallConversionRate: inquiries > 0 ? (paymentsCompleted / inquiries) * 100 : 0,
    averageTimeToPaymentMs,
  };
}

/**
 * Get time-to-conversion for successful conversions
 */
export async function getTimeToConversion(startDate: Date, endDate: Date) {
  const conversions = await prisma.booking.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      payment: {
        status: 'PAID',
      },
    },
    include: {
      payment: true,
    },
  });

  if (conversions.length === 0) {
    return {
      averageTimeToConversionDays: 0,
      medianTimeToConversionDays: 0,
      minTimeToConversionDays: 0,
      maxTimeToConversionDays: 0,
    };
  }

  const timeDiffsInDays = conversions
    .map((booking) => {
      if (booking.payment?.paidAt) {
        const diffMs = booking.payment.paidAt.getTime() - booking.createdAt.getTime();
        return diffMs / (1000 * 60 * 60 * 24); // Convert to days
      }
      return 0;
    })
    .filter((diff) => diff > 0)
    .sort((a, b) => a - b);

  const average = timeDiffsInDays.reduce((a, b) => a + b, 0) / timeDiffsInDays.length;
  const median = timeDiffsInDays[Math.floor(timeDiffsInDays.length / 2)];

  return {
    averageTimeToConversionDays: Math.round(average),
    medianTimeToConversionDays: Math.round(median),
    minTimeToConversionDays: Math.round(Math.min(...timeDiffsInDays)),
    maxTimeToConversionDays: Math.round(Math.max(...timeDiffsInDays)),
  };
}

/**
 * Get conversion rates at each funnel stage
 */
export async function getStageConversionRates(startDate: Date, endDate: Date) {
  const funnel = await getConversionFunnel(startDate, endDate);
  const inquiries = funnel.stages[0].count;

  return {
    inquiryToQualified: funnel.stages[1].percentage,
    qualifiedToBooking: inquiries > 0 ? (funnel.stages[2].count / inquiries) * 100 : 0,
    bookingToProposal: funnel.stages[2].count > 0 ? (funnel.stages[3].count / funnel.stages[2].count) * 100 : 0,
    proposalToAccepted: funnel.stages[3].count > 0 ? (funnel.stages[4].count / funnel.stages[3].count) * 100 : 0,
    acceptedToPayment: funnel.stages[4].count > 0 ? (funnel.stages[5].count / funnel.stages[4].count) * 100 : 0,
    overallConversionRate: funnel.overallConversionRate,
  };
}
