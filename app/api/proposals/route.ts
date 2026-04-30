import { NextRequest, NextResponse } from 'next/server';
import {
  createProposal,
  getProposals,
  getProposalById,
  getProposalFunnelStats,
} from '@/lib/proposal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/proposals
 * Create a new proposal
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      bookingId,
      title,
      description,
      servicesOffered,
      totalAmount,
      currency,
      validUntil,
      notes,
    } = body;

    // Validate required fields
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const proposal = await createProposal({
      bookingId,
      title: title || undefined,
      description: description || undefined,
      servicesOffered: servicesOffered || undefined,
      totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
      currency: currency || 'NGN',
      validUntil: validUntil ? new Date(validUntil) : undefined,
      notes: notes || undefined,
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    const message = error instanceof Error ? error.message : 'Failed to create proposal';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/proposals
 * Get proposals with filtering and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || '';
    const stats = searchParams.get('stats') === 'true';

    // If stats requested, return funnel stats instead
    if (stats) {
      const funnelStats = await getProposalFunnelStats();
      return NextResponse.json(funnelStats);
    }

    const result = await getProposals(page, limit, status as any, search);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}
