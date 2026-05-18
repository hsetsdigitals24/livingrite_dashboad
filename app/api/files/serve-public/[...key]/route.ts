import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2 } from '@/lib/r2';

const SIGNED_URL_EXPIRY = 3600; // 1 hour

/**
 * GET /api/files/serve-public/[...key]
 * No auth — for assets that are referenced from public pages (popup images,
 * case-study covers, public profile images). Resolves the URL path to an R2
 * key, signs it, and 302s. Keeping this routed through us lets the underlying
 * bucket stay private; the URL still acts as the bearer.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key: segments } = await params;

  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: 'Missing file key' }, { status: 400 });
  }

  const key = segments.map((s) => decodeURIComponent(s)).join('/');

  const signedUrl = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }),
    { expiresIn: SIGNED_URL_EXPIRY }
  );

  // Cache the redirect at the edge for ~5 minutes. The destination signed URL
  // is valid for an hour, so a 5-minute cache window guarantees followers won't
  // hit an expired link. Use a shorter max-age than expiry to leave headroom.
  const response = NextResponse.redirect(signedUrl, 302);
  response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
  return response;
}
