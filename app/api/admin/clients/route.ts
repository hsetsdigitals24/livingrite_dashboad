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
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validPageSize = Math.min(Math.max(1, pageSize), 100); // Max 100 items per page

    // Build filter conditions
    const whereConditions: any = {
      role: 'CLIENT',
      NOT: {
        role: {
          in: ['CAREGIVER', 'ADMIN'],
        },
      },
    };

    // Search across name and email
    if (searchTerm) {
      whereConditions.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { userProfile: { name: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    // Calculate pagination
    const skip = (validPage - 1) * validPageSize;

    // Fetch total count for pagination info
    const total = await prisma.user.count({
      where: whereConditions,
    });

    // Fetch paginated clients with their profiles and related data
    const clients = await prisma.user.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        userProfile: {
          select: {
            id: true,
            name: true,
            age: true,
            biologicalGender: true,
            medicalConditions: true,
            timezone: true,
          },
        },
        _count: {
          select: {
            medicalAppointments: true,
            vitals: true,
            dailyLogs: true,
          },
        },
      },
      orderBy:
        sortBy === 'name'
          ? { name: sortOrder }
          : sortBy === 'email'
          ? { email: sortOrder }
          : { createdAt: sortOrder },
      skip,
      take: validPageSize,
    });

    // Transform data for frontend
    const transformedClients = clients.map((client) => ({
      id: client.id,
      name: client.name || client.userProfile?.name || 'N/A',
      email: client.email,
      image: client.image,
      status: client.emailVerified ? 'ACTIVE' : 'PENDING',
      joinDate: client.createdAt,
      lastActive: client.updatedAt,
      age: client.userProfile?.age,
      gender: client.userProfile?.biologicalGender,
      medicalConditions: client.userProfile?.medicalConditions || [],
      timezone: client.userProfile?.timezone,
      appointmentsCount: client._count.medicalAppointments,
      vitalsCount: client._count.vitals,
      logsCount: client._count.dailyLogs,
    }));

    const totalPages = Math.ceil(total / validPageSize);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;

    return NextResponse.json({
      data: transformedClients,
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
    console.error('Error fetching paginated clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}