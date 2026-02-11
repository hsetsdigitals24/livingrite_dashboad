import { prisma } from '@/lib/prisma';
import { InquiryStatus } from '@prisma/client';

export interface CreateInquiryInput {
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  inquirySource?: string | null;
  subject?: string | null;
  message?: string | null;
  notes?: string | null;
}

export interface UpdateInquiryInput {
  subject?: string;
  message?: string;
  notes?: string;
}

/**
 * Create a new inquiry
 * @param data - Inquiry data
 * @returns Created inquiry
 */
export async function createInquiry(data: CreateInquiryInput) {
  const inquiry = await prisma.inquiry.create({
    data: {
      userId: data.userId,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      inquirySource: data.inquirySource || 'website_form',
      subject: data.subject || null,
      message: data.message || null,
      notes: data.notes || null,
      status: InquiryStatus.NEW,
    },
  });

  // Update user's conversion stage if still a PROSPECT
  await prisma.user.update({
    where: { id: data.userId },
    data: {
      conversionStage: 'INQUIRY',
      inquiryDate: new Date(),
    },
  });

  return inquiry;
}

/**
 * Get inquiries with filtering and pagination
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @param status - Filter by status
 * @param search - Search term for name or email
 * @returns Paginated list of inquiries
 */
export async function getInquiries(
  page: number = 1,
  limit: number = 10,
  status?: InquiryStatus,
  search: string = ''
) {
  const skip = (page - 1) * limit;

  // Build filters
  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } },
      { subject: { contains: search, mode: 'insensitive' as const } },
    ];
  }

  // Fetch inquiries
  const inquiries = await prisma.inquiry.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      inquirySource: true,
      status: true,
      qualifiedAt: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  // Get total count
  const total = await prisma.inquiry.count({ where });

  return {
    data: inquiries,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single inquiry by ID
 * @param id - Inquiry ID
 * @returns Inquiry with full details
 */
export async function getInquiryById(id: string) {
  return await prisma.inquiry.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      },
    },
  });
}

/**
 * Update an inquiry
 * @param id - Inquiry ID
 * @param data - Fields to update
 * @returns Updated inquiry
 */
export async function updateInquiry(id: string, data: UpdateInquiryInput) {
  return await prisma.inquiry.update({
    where: { id },
    data,
  });
}

/**
 * Mark inquiry as qualified
 * @param id - Inquiry ID
 * @returns Updated inquiry
 */
export async function qualifyInquiry(id: string) {
  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: {
      status: InquiryStatus.QUALIFIED,
      qualifiedAt: new Date(),
    },
  });

  return inquiry;
}

/**
 * Mark inquiry as disqualified
 * @param id - Inquiry ID
 * @param reason - Reason for disqualification
 * @returns Updated inquiry
 */
export async function disqualifyInquiry(id: string, reason: string) {
  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: {
      status: InquiryStatus.DISQUALIFIED,
      disqualifiedAt: new Date(),
      disqualificationReason: reason,
    },
  });

  return inquiry;
}

/**
 * Convert inquiry to booking
 * @param inquiryId - Inquiry ID
 * @param bookingId - Booking ID to link
 * @returns Updated inquiry
 */
export async function convertInquiryToBooking(inquiryId: string, bookingId: string) {
  const inquiry = await prisma.inquiry.update({
    where: { id: inquiryId },
    data: {
      status: InquiryStatus.CONVERTED,
      convertedToBookingAt: new Date(),
      convertedToBookingId: bookingId,
    },
  });

  // Update user's conversion stage
  await prisma.user.update({
    where: { id: inquiry.userId },
    data: {
      conversionStage: 'CONSULTATION_BOOKED',
    },
  });

  return inquiry;
}

/**
 * Get inquiry conversion funnel stats
 * @returns Funnel data with counts per stage
 */
export async function getInquiryFunnelStats() {
  const total = await prisma.inquiry.count();
  const newInquiries = await prisma.inquiry.count({
    where: { status: InquiryStatus.NEW },
  });
  const qualified = await prisma.inquiry.count({
    where: { status: InquiryStatus.QUALIFIED },
  });
  const disqualified = await prisma.inquiry.count({
    where: { status: InquiryStatus.DISQUALIFIED },
  });
  const converted = await prisma.inquiry.count({
    where: { status: InquiryStatus.CONVERTED },
  });

  return {
    total,
    byStatus: {
      new: newInquiries,
      qualified,
      disqualified,
      converted,
    },
    conversionRate: total > 0 ? (converted / total) * 100 : 0,
    qualificationRate: (newInquiries + qualified) > 0 ? (qualified / (newInquiries + qualified)) * 100 : 0,
  };
}
