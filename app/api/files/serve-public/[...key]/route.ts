import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decompressFromBase64 } from '@/lib/file-storage';

/**
 * GET /api/files/serve-public/[...key]
 * No auth — for assets referenced from public pages (popup images, case-study
 * covers, public profile images). The first path segment is the File record id;
 * the inline gzip+base64 bytes are decompressed and streamed.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key: segments } = await params;

  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: 'Missing file id' }, { status: 400 });
  }

  const fileId = decodeURIComponent(segments[0]);

  const fileRecord = await prisma.file.findUnique({
    where: { id: fileId },
    select: { data: true, mimeType: true },
  });

  if (!fileRecord || !fileRecord.data) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const buffer = decompressFromBase64(fileRecord.data);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': fileRecord.mimeType,
      'Content-Length': String(buffer.length),
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
