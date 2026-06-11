import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// In-process throttle: same (IP, popupId) can only increment once per window.
// Sufficient for casual abuse protection — for production-grade rate limiting
// across instances, swap for Redis/Vercel KV.
const THROTTLE_WINDOW_MS = 60_000;
const MAX_ENTRIES = 5000;
const recent = new Map<string, number>();

function isThrottled(key: string): boolean {
  const now = Date.now();
  const last = recent.get(key);
  if (last && now - last < THROTTLE_WINDOW_MS) return true;

  // Crude size cap. Avoids unbounded growth; loses some throttle precision
  // around the cap boundary, which is fine for telemetry.
  if (recent.size >= MAX_ENTRIES) recent.clear();
  recent.set(key, now);
  return false;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (isThrottled(`${ip}:${id}`)) {
      // Return 200 so the client doesn't surface this as an error — throttling
      // is a normal outcome of legitimate retry/refresh patterns.
      return NextResponse.json({ throttled: true });
    }

    const popup = await prisma.landingPagePopup.update({
      where: { id },
      data: { popupCount: { increment: 1 } },
      select: { id: true, popupCount: true },
    });

    return NextResponse.json(popup);
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Popup not found' }, { status: 404 });
    }
    console.error('Error incrementing popup count:', error);
    return NextResponse.json(
      { error: 'Failed to increment popup count' },
      { status: 500 }
    );
  }
}
