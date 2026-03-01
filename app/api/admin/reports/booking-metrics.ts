import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  getBookingMetrics,
  getBookingTrends,
} from '@/lib/reporting/bookings';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    const metric = searchParams.get('metric') || 'metrics'; // 'metrics' or 'trends'
    const groupBy = (searchParams.get('groupBy') as 'day' | 'week' | 'month') || 'week';

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: 'startDate and endDate query parameters are required' },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    let data;

    if (metric === 'trends') {
      data = await getBookingTrends(startDate, endDate, groupBy);
    } else {
      data = await getBookingMetrics(startDate, endDate);
    }

    return NextResponse.json({
      success: true,
      data,
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch booking metrics:', errorMsg);
    return NextResponse.json(
      { error: 'Failed to fetch booking metrics', details: errorMsg },
      { status: 500 }
    );
  }
}
