import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/caregiver-allow-list/bulk
 * Bulk import emails from CSV
 * CSV should have one email per line
 * Admin-only endpoint
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can access this endpoint' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file contents
    const text = await file.text();
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.includes('@')); // Basic email validation

    if (lines.length === 0) {
      return NextResponse.json(
        { error: 'No valid emails found in file' },
        { status: 400 }
      );
    }

    // Deduplicate and validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = Array.from(new Set(
      lines.filter((email) => emailRegex.test(email))
    ));

    if (validEmails.length === 0) {
      return NextResponse.json(
        { error: 'No valid emails found after validation' },
        { status: 400 }
      );
    }

    // Get existing emails to avoid duplicates
    const existingEmails = await prisma.caregiverAllowList.findMany({
      where: {
        email: {
          in: validEmails,
        },
      },
      select: { email: true },
    });

    const existingEmailSet = new Set(existingEmails.map((e: { email: string }) => e.email));
    const newEmails = validEmails.filter((email) => !existingEmailSet.has(email));

    // Bulk create new entries
    const result = await prisma.caregiverAllowList.createMany({
      data: newEmails.map((email) => ({
        email,
        status: 'APPROVED',
        addedBy: session.user.id,
        approvedAt: new Date(),
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: `Successfully imported ${result.count} new emails`,
      totalInFile: validEmails.length,
      imported: result.count,
      skipped: validEmails.length - result.count,
    });
  } catch (error) {
    console.error('Error bulk importing caregiver allow list:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to bulk import';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/admin/caregiver-allow-list/bulk
 * Export allow list as CSV
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can access this endpoint' },
        { status: 403 }
      );
    }

    // Get all approved emails
    const items = await prisma.caregiverAllowList.findMany({
      where: { status: 'APPROVED' },
      select: { email: true, addedAt: true },
      orderBy: { email: 'asc' },
    });

    // Format as CSV
    const csv =
      'Email,Added Date\n' +
      items
        .map(
          (item: { email: string; addedAt: Date }) =>
            `${item.email},${new Date(item.addedAt).toISOString().split('T')[0]}`
        )
        .join('\n');

    const response = new NextResponse(csv);
    response.headers.set(
      'Content-Disposition',
      'attachment; filename="caregiver-allow-list.csv"'
    );
    response.headers.set('Content-Type', 'text/csv');

    return response;
  } catch (error) {
    console.error('Error exporting caregiver allow list:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to export allow list';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
