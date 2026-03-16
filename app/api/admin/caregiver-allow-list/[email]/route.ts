import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/admin/caregiver-allow-list/[email]
 * Remove an email from the caregiver allow list
 * Admin-only endpoint
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can access this endpoint' },
        { status: 403 }
      );
    }

    const { email } = await params;

    // Decode URL-encoded email
    const decodedEmail = decodeURIComponent(email);

    // Find and delete
    const result = await prisma.caregiverAllowList.delete({
      where: { email: decodedEmail },
    });

    return NextResponse.json({
      message: 'Email removed from allow list',
      removed: result,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Email not found in allow list' },
        { status: 404 }
      );
    }

    console.error('Error removing from caregiver allow list:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to remove email';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
