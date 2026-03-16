import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/caregiver-allow-list
 * Get list of approved caregiver emails
 * Admin-only endpoint
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can access this endpoint' },
        { status: 403 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: any = {};

    // Search by email
    if (search) {
      where.email = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.caregiverAllowList.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.caregiverAllowList.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching caregiver allow list:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to fetch allow list';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/admin/caregiver-allow-list
 * Add a single email to the caregiver allow list
 * Admin-only endpoint
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can access this endpoint' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, status = 'APPROVED', notes } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.caregiverAllowList.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email already on allow list' },
        { status: 409 }
      );
    }

    // Add to allow list
    const allowListEntry = await prisma.caregiverAllowList.create({
      data: {
        email,
        status,
        addedBy: session.user.id,
        notes,
        approvedAt: status === 'APPROVED' ? new Date() : null,
      },
    });

    return NextResponse.json(allowListEntry, { status: 201 });
  } catch (error) {
    console.error('Error adding to caregiver allow list:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to add email';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
