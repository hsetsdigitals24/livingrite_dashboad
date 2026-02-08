import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

interface PaginatedResponse {
  data: any[];
  pagination: {
    total: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function GET(req: NextRequest): Promise<NextResponse<PaginatedResponse | { error: string }>> {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const searchTerm = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || '';
    const paymentStatusFilter = searchParams.get('paymentStatus') || '';

    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validPageSize = Math.min(Math.max(1, pageSize), 100); // Max 100 items per page

    // Build filter conditions
    const whereConditions: any = {};

    // Search across client name, email, and service
    if (searchTerm) {
      whereConditions.OR = [
        { clientName: { contains: searchTerm, mode: 'insensitive' } },
        { clientEmail: { contains: searchTerm, mode: 'insensitive' } },
        { eventTitle: { contains: searchTerm, mode: 'insensitive' } },
        { note: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Filter by status
    if (statusFilter && statusFilter !== 'all') {
      whereConditions.status = statusFilter.toUpperCase();
    }

    // Filter by payment status
    if (paymentStatusFilter && paymentStatusFilter !== 'all') {
      whereConditions.paymentStatus = paymentStatusFilter.toUpperCase();
    }

    // Calculate pagination
    const skip = (validPage - 1) * validPageSize;

    // Fetch total count for pagination info
    const total = await prisma.booking.count({
      where: whereConditions,
    });

    // Fetch paginated bookings
    const bookings = await prisma.booking.findMany({
      where: whereConditions,
      select: {
        id: true,
        calcomId: true,
        clientName: true,
        clientEmail: true,
        clientPhone: true,
        timezone: true,
        eventTitle: true,
        note: true,
        scheduledAt: true,
        duration: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        cancelledAt: true,
        confirmationSent: true,
        reminderSent: true,
        thankYouSent: true,
        followUpSent: true,
      },
      orderBy: {
        scheduledAt: 'desc',
      },
      skip,
      take: validPageSize,
    });

    const totalPages = Math.ceil(total / validPageSize);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;

    return NextResponse.json({
      data: bookings,
      pagination: {
        total,
        pageSize: validPageSize,
        currentPage: validPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.error('Error fetching paginated bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
