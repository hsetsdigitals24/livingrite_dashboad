import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Public read endpoint — any authenticated user can fetch bank account details
// (needed so clients can see payment info on their invoice page)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const settings = await (prisma as any).paymentSettings.findFirst({
      select: {
        bankName: true,
        accountName: true,
        accountNumber: true,
        bankCode: true,
        additionalInfo: true,
      },
    });

    // Return empty object if not configured yet rather than 404
    return NextResponse.json(settings || {
      bankName: '',
      accountName: '',
      accountNumber: '',
      bankCode: '',
      additionalInfo: '',
    });
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    return NextResponse.json({ error: 'Failed to fetch payment settings' }, { status: 500 });
  }
}
