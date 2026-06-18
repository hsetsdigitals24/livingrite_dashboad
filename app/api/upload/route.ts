import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { compressToBase64 } from '@/lib/file-storage';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';

// Public-image upload endpoint: stores the bytes inline (gzip+base64) in the
// database and returns a no-auth serve URL. Used for case studies, popups, and
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
 * Store a file inline in the database and return a public serve URL.
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
    const key = `${session.user.id}/${uuidv4()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = compressToBase64(buffer);

    // Store the bytes inline (gzip+base64) and serve via the no-auth redirector,
    // which decompresses and streams them. Callers embed the returned URL
    // directly in <img src> / content fields.
    const record = await prisma.file.create({
      data: {
        filename: key,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        data,
        url: '',
      },
    });

    const url = `/api/files/serve-public/${record.id}`;
    await prisma.file.update({ where: { id: record.id }, data: { url } });

    return NextResponse.json({ url, filename: file.name }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
