import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

// Generate a random 12-character alphanumeric code
function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET() {
  try {
    const codes = await prisma.adminSignupCode.findMany({
      select: {
        id: true,
        code: true,
        createdAt: true,
        expiresAt: true,
        isUsed: true,
        usedBy: true,
        usedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(codes);
  } catch (error) {
    console.error('Error fetching codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch codes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { expiryDays = 30 } = body;

    // Get current session to know who is creating this code
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate unique code
    let code = generateCode();
    let existingCode = await prisma.adminSignupCode.findUnique({
      where: { code },
    });

    // Retry if code already exists (highly unlikely)
    while (existingCode) {
      code = generateCode();
      existingCode = await prisma.adminSignupCode.findUnique({
        where: { code },
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    const newCode = await prisma.adminSignupCode.create({
      data: {
        code,
        expiresAt,
        createdBy: session.user.email,
      },
      select: {
        id: true,
        code: true,
        createdAt: true,
        expiresAt: true,
        isUsed: true,
        usedBy: true,
        usedAt: true,
      },
    });

    return NextResponse.json(newCode);
  } catch (error) {
    console.error('Error generating code:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}
