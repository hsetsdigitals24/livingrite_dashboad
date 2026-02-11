import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET: Fetch clients (users with CLIENT role) with pagination, search, and sorting
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const skip = (page - 1) * limit;

    // Build search filter with proper Prisma typing
    const searchFilter: Prisma.UserWhereInput = {
      role: 'CLIENT' as const,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ],
          }
        : {}),
    };

    // Fetch clients with their associated records
    const clients = await prisma.user.findMany({
      where: searchFilter,
      include: {
        familyMemberAssignments: {
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        bookings: {
          orderBy: { scheduledAt: 'desc' },
          take: 5,
          include: {
            service: {
              select: {
                id: true,
                title: true,
              },
            },
            payment: {
              select: {
                id: true,
                status: true,
                amount: true,
              },
            },
          },
        },
        accounts: {
          select: {
            provider: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.user.count({
      where: {
        role: 'CLIENT',
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
                { phone: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
    });

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}