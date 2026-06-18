import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { compressToBase64 } from '@/lib/file-storage';
import { prisma } from '@/lib/prisma';
import { requireRole, requireAnyPatientAccess } from '@/lib/api-auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

/**
 * POST /api/files/upload
 * Upload a patient document and persist a File record with the gzip+base64
 * encoded bytes stored inline in the database. The stored `url` points to an
 * auth-gated redirector (/api/files/serve/[id]) that decompresses and streams
 * the file on each request.
 *
 * Form fields:
 *   - file: required, the binary
 *   - patientId: required, the patient this file belongs to
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole('ADMIN', 'CLIENT', 'CAREGIVER');
    if (auth.response) return auth.response;
    const { session } = auth;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const patientId = formData.get('patientId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!patientId) {
      return NextResponse.json(
        { error: 'patientId is required' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const accessDenied = await requireAnyPatientAccess(patientId, session, { write: true });
    if (accessDenied) return accessDenied;

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const key = `patient-files/${patientId}/${uuidv4()}-${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = compressToBase64(buffer);

    // Store the bytes inline (gzip+base64) and point the URL at the auth-gated
    // redirector, which decompresses and streams the file on each request.
    const record = await prisma.file.create({
      data: {
        filename: key,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        patientId,
        data,
        url: '',
      },
    });

    const updated = await prisma.file.update({
      where: { id: record.id },
      data: { url: `/api/files/serve/${record.id}` },
    });

    return NextResponse.json(
      {
        id: updated.id,
        url: updated.url,
        filename: updated.originalName,
        size: updated.size,
        type: updated.mimeType,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
