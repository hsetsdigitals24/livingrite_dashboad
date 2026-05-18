import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { prisma } from '@/lib/prisma';
import { r2 } from '@/lib/r2';
import { requireRole, requireAnyPatientAccess } from '@/lib/api-auth';

const SIGNED_URL_EXPIRY = 3600; // 1 hour

/**
 * GET /api/files/serve/[fileId]
 * Authorize the requester for the file's patient, mint a short-lived signed R2
 * URL, and 302 to it. Stored File.url points here so links don't go stale.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const auth = await requireRole('ADMIN', 'CLIENT', 'CAREGIVER');
  if (auth.response) return auth.response;
  const { session } = auth;

  const { fileId } = await params;

  const fileRecord = await prisma.file.findUnique({
    where: { id: fileId },
    select: { filename: true, patientId: true },
  });

  if (!fileRecord) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  if (!fileRecord.patientId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const accessDenied = await requireAnyPatientAccess(fileRecord.patientId, session);
  if (accessDenied) return accessDenied;

  const signedUrl = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileRecord.filename,
    }),
    { expiresIn: SIGNED_URL_EXPIRY }
  );

  return NextResponse.redirect(signedUrl, 302);
}
