import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decompressFromBase64 } from '@/lib/file-storage';
import { requireRole, requireAnyPatientAccess } from '@/lib/api-auth';

/**
 * GET /api/files/serve/[fileId]
 * Authorize the requester for the file's patient, then decompress the inline
 * gzip+base64 bytes and stream them. Stored File.url points here.
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
    select: { data: true, mimeType: true, patientId: true },
  });

  if (!fileRecord || !fileRecord.data) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  if (!fileRecord.patientId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const accessDenied = await requireAnyPatientAccess(fileRecord.patientId, session);
  if (accessDenied) return accessDenied;

  const buffer = decompressFromBase64(fileRecord.data);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': fileRecord.mimeType,
      'Content-Length': String(buffer.length),
      'Cache-Control': 'private, max-age=300',
    },
  });
}
