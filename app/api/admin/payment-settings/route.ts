import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await (prisma as any).paymentSettings.findFirst();

    if (!settings) {
      // Return defaults if not configured yet
      settings = {
        id: null,
        bankName: '',
        accountName: '',
        accountNumber: '',
        bankCode: '',
        additionalInfo: '',
      };
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    return NextResponse.json({ error: 'Failed to fetch payment settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bankName, accountName, accountNumber, bankCode, additionalInfo } = await req.json();

    if (!bankName || !accountName || !accountNumber) {
      return NextResponse.json(
        { error: 'Bank name, account name, and account number are required' },
        { status: 400 }
      );
    }

    // Upsert — only one record ever exists
    const existing = await (prisma as any).paymentSettings.findFirst();

    let settings;
    if (existing) {
      settings = await (prisma as any).paymentSettings.update({
        where: { id: existing.id },
        data: { bankName, accountName, accountNumber, bankCode: bankCode || '', additionalInfo: additionalInfo || '' },
      });
    } else {
      settings = await (prisma as any).paymentSettings.create({
        data: { bankName, accountName, accountNumber, bankCode: bankCode || '', additionalInfo: additionalInfo || '' },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving payment settings:', error);
    return NextResponse.json({ error: 'Failed to save payment settings' }, { status: 500 });
  }
}
