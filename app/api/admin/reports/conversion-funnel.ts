import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  getConversionFunnel,
  getTimeToConversion,
  getStageConversionRates,
} from '@/lib/reporting/conversion';

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
    const detail = searchParams.get('detail') || 'full'; // 'full', 'funnel', 'timing', 'rates'

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

    const funnel = await getConversionFunnel(startDate, endDate);
    const timing = await getTimeToConversion(startDate, endDate);
    const rates = await getStageConversionRates(startDate, endDate);

    let data;

    if (detail === 'funnel') {
      data = funnel;
    } else if (detail === 'timing') {
      data = timing;
    } else if (detail === 'rates') {
      data = rates;
    } else {
      data = {
        funnel,
        timing,
        rates,
      };
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
    console.error('Failed to fetch conversion funnel metrics:', errorMsg);
    return NextResponse.json(
      { error: 'Failed to fetch conversion funnel metrics', details: errorMsg },
      { status: 500 }
    );
  }
}
