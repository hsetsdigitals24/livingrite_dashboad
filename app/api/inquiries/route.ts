import { NextRequest, NextResponse } from 'next/server';
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  getInquiryFunnelStats,
} from '@/lib/inquiry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/inquiries
 * Create a new inquiry
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      inquirySource,
      subject,
      message,
      notes,
      userId,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // If userId not provided, get from session (for authenticated requests)
    let finalUserId = userId;
    if (!finalUserId) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      finalUserId = session.user.id;
    }

    const inquiry = await createInquiry({
      userId: finalUserId,
      name,
      email,
      phone: phone || null,
      inquirySource: inquirySource || 'website_form',
      subject: subject || null,
      message: message || null,
      notes: notes || null,
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    const message = error instanceof Error ? error.message : 'Failed to create inquiry';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/inquiries
 * Get inquiries with filtering and pagination
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
      const funnelStats = await getInquiryFunnelStats();
      return NextResponse.json(funnelStats);
    }

    const result = await getInquiries(page, limit, status as any, search);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}
