import { prisma } from '@/lib/prisma';
import { ProposalStatus, BookingStatus } from '@prisma/client';

export interface CreateProposalInput {
  bookingId: string;
  title?: string;
  description?: string;
  servicesOffered?: any;
  totalAmount?: number;
  currency?: string;
  validUntil?: Date;
  notes?: string;
}

export interface UpdateProposalInput {
  title?: string;
  description?: string;
  servicesOffered?: any;
  totalAmount?: number;
  validUntil?: Date;
  notes?: string;
}

/**
 * Create a new proposal
 * @param data - Proposal data
 * @returns Created proposal
 */
export async function createProposal(data: CreateProposalInput) {
  // Verify booking exists
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  const proposal = await prisma.proposal.create({
    data: {
      bookingId: data.bookingId,
      status: ProposalStatus.DRAFT,
      title: data.title || `Proposal for ${booking.clientName}`,
      description: data.description || null,
      servicesOffered: data.servicesOffered || null,
      totalAmount: data.totalAmount || null,
      currency: data.currency || 'NGN',
      validUntil: data.validUntil || null,
      notes: data.notes || null,
    },
  });

  return proposal;
}

/**
 * Get proposals with filtering and pagination
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @param status - Filter by status
 * @param search - Search term for client name/email
 * @returns Paginated list of proposals
 */
export async function getProposals(
  page: number = 1,
  limit: number = 10,
  status?: ProposalStatus,
  search: string = ''
) {
  const skip = (page - 1) * limit;

  // Build filters
  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.booking = {
      OR: [
        { clientName: { contains: search, mode: 'insensitive' as const } },
        { clientEmail: { contains: search, mode: 'insensitive' as const } },
      ],
    };
  }

  // Fetch proposals
  const proposals = await prisma.proposal.findMany({
    where,
    include: {
      booking: {
        select: {
          id: true,
          clientName: true,
          clientEmail: true,
          clientPhone: true,
          status: true,
          service: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  // Get total count
  const total = await prisma.proposal.count({ where });

  return {
    data: proposals,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single proposal by ID
 * @param id - Proposal ID
 * @returns Proposal with booking details
 */
export async function getProposalById(id: string) {
  return await prisma.proposal.findUnique({
    where: { id },
    include: {
      booking: {
        include: {
          service: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Update a proposal
 * @param id - Proposal ID
 * @param data - Fields to update
 * @returns Updated proposal
 */
export async function updateProposal(id: string, data: UpdateProposalInput) {
  return await prisma.proposal.update({
    where: { id },
    data,
  });
}

/**
 * Send a proposal
 * @param id - Proposal ID
 * @returns Updated proposal
 */
export async function sendProposal(id: string) {
  const proposal = await prisma.proposal.update({
    where: { id },
    data: {
      status: ProposalStatus.SENT,
      sentAt: new Date(),
    },
  });

  // Update booking status to PROPOSAL
  await prisma.booking.update({
    where: { id: proposal.bookingId },
    data: {
      status: BookingStatus.PROPOSAL,
      proposalSentAt: new Date(),
    },
  });

  return proposal;
}

/**
 * Mark proposal as viewed
 * @param id - Proposal ID
 * @returns Updated proposal
 */
export async function markProposalViewed(id: string) {
  return await prisma.proposal.update({
    where: { id },
    data: {
      status: ProposalStatus.VIEWED,
      viewedAt: new Date(),
    },
  });
}

/**
 * Accept a proposal
 * @param id - Proposal ID
 * @returns Updated proposal
 */
export async function acceptProposal(id: string) {
  const proposal = await prisma.proposal.update({
    where: { id },
    data: {
      status: ProposalStatus.ACCEPTED,
      acceptedAt: new Date(),
    },
  });

  // Update user's conversion stage to CLIENT
  const booking = await prisma.booking.findUnique({
    where: { id: proposal.bookingId },
    select: { userId: true },
  });

  if (booking) {
    await prisma.user.update({
      where: { id: booking.userId },
      data: {
        conversionStage: 'CLIENT',
        clientConvertedAt: new Date(),
      },
    });
  }

  return proposal;
}

/**
 * Reject a proposal
 * @param id - Proposal ID
 * @param reason - Reason for rejection
 * @returns Updated proposal
 */
export async function rejectProposal(id: string, reason: string) {
  return await prisma.proposal.update({
    where: { id },
    data: {
      status: ProposalStatus.REJECTED,
      rejectedAt: new Date(),
      rejectionReason: reason,
    },
  });
}

/**
 * Get proposal conversion funnel stats
 * @returns Funnel data with counts per stage
 */
export async function getProposalFunnelStats() {
  const total = await prisma.proposal.count();
  const draft = await prisma.proposal.count({
    where: { status: ProposalStatus.DRAFT },
  });
  const sent = await prisma.proposal.count({
    where: { status: ProposalStatus.SENT },
  });
  const viewed = await prisma.proposal.count({
    where: { status: ProposalStatus.VIEWED },
  });
  const accepted = await prisma.proposal.count({
    where: { status: ProposalStatus.ACCEPTED },
  });
  const rejected = await prisma.proposal.count({
    where: { status: ProposalStatus.REJECTED },
  });

  return {
    total,
    byStatus: {
      draft,
      sent,
      viewed,
      accepted,
      rejected,
    },
    acceptanceRate: (sent + viewed) > 0 ? (accepted / (sent + viewed)) * 100 : 0,
    viewRate: sent > 0 ? (viewed / sent) * 100 : 0,
  };
}
