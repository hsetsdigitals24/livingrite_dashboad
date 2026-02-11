import { NextRequest, NextResponse } from 'next/server';
import {
  getInquiryById,
  updateInquiry,
  qualifyInquiry,
  disqualifyInquiry,
  convertInquiryToBooking,
} from '@/lib/inquiry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/inquiries/[id]
 * Get a single inquiry by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inquiry = await getInquiryById(params.id);

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/inquiries/[id]
 * Update an inquiry or change its status
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
    const { action, reason, bookingId, subject, message, notes } = body;

    // Handle actions
    if (action === 'qualify') {
      const inquiry = await qualifyInquiry(params.id);
      return NextResponse.json(inquiry);
    }

    if (action === 'disqualify') {
      if (!reason) {
        return NextResponse.json(
          { error: 'Disqualification reason is required' },
          { status: 400 }
        );
      }
      const inquiry = await disqualifyInquiry(params.id, reason);
      return NextResponse.json(inquiry);
    }

    if (action === 'convert') {
      if (!bookingId) {
        return NextResponse.json(
          { error: 'Booking ID is required' },
          { status: 400 }
        );
      }
      const inquiry = await convertInquiryToBooking(params.id, bookingId);
      return NextResponse.json(inquiry);
    }

    // Regular update
    const updatedInquiry = await updateInquiry(params.id, {
      subject: subject || undefined,
      message: message || undefined,
      notes: notes || undefined,
    });

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    const message = error instanceof Error ? error.message : 'Failed to update inquiry';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
