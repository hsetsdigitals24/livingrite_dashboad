import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { r2 } from '@/lib/r2';
import { requireRole } from '@/lib/api-auth';

// Public-image upload endpoint: returns a permanent CDN URL backed by the
// bucket's public-read configuration. Used for case studies, popups, and
// profile images — not for patient documents (use /api/files/upload).
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * POST /api/upload
 * Upload a file to Cloudflare R2 and return its public URL.
 * Returns: { url: string, filename: string }
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole();
    if (auth.response) return auth.response;
    const { session } = auth;

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop();
    const filename = `${session.user.id}/${uuidv4()}.${ext}`;

    const buffer = await file.arrayBuffer();

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: filename,
        Body: Buffer.from(buffer),
        ContentType: file.type,
        Metadata: {
          'uploaded-by': session.user.id,
          'upload-time': new Date().toISOString(),
        },
      })
    );

    // Route through our redirector so the R2 bucket can stay private. The
    // redirector signs and 302s on each request; tokens expire (1h) but the
    // stored URL itself never goes stale.
    const url = `/api/files/serve-public/${filename}`;

    return NextResponse.json({ url, filename }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
