import { NextRequest, NextResponse } from 'next/server';
import {
  getProposalById,
  updateProposal,
  sendProposal,
  markProposalViewed,
  acceptProposal,
  rejectProposal,
} from '@/lib/proposal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/proposals/[id]
 * Get a single proposal by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await getProposalById(params.id);

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/proposals/[id]
 * Update a proposal or change its status
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
      action,
      reason,
      title,
      description,
      servicesOffered,
      totalAmount,
      validUntil,
      notes,
    } = body;

    // Handle actions
    if (action === 'send') {
      const proposal = await sendProposal(params.id);
      return NextResponse.json(proposal);
    }

    if (action === 'viewed') {
      const proposal = await markProposalViewed(params.id);
      return NextResponse.json(proposal);
    }

    if (action === 'accept') {
      const proposal = await acceptProposal(params.id);
      return NextResponse.json(proposal);
    }

    if (action === 'reject') {
      if (!reason) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }
      const proposal = await rejectProposal(params.id, reason);
      return NextResponse.json(proposal);
    }

    // Regular update
    const updatedProposal = await updateProposal(params.id, {
      title: title || undefined,
      description: description || undefined,
      servicesOffered: servicesOffered || undefined,
      totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      notes: notes || undefined,
    });

    return NextResponse.json(updatedProposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    const message = error instanceof Error ? error.message : 'Failed to update proposal';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
