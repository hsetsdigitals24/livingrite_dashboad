import { NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';
import { r2 } from '@/lib/r2';
import { requireRole, requireAnyPatientAccess } from '@/lib/api-auth';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const auth = await requireRole('ADMIN', 'CLIENT', 'CAREGIVER');
  if (auth.response) return auth.response;
  const { session } = auth;

  const { fileId } = await params;

  if (!fileId) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
  }

  const fileRecord = await prisma.file.findUnique({
    where: { id: fileId },
    select: { id: true, filename: true, patientId: true },
  });

  if (!fileRecord) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // A file without a patientId is an unowned upload — refuse to delete via this
  // endpoint rather than risk anonymous deletion. Such files should be cleaned
  // up by an admin tool.
  if (!fileRecord.patientId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const accessDenied = await requireAnyPatientAccess(fileRecord.patientId, session, {
    write: true,
  });
  if (accessDenied) return accessDenied;

  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileRecord.filename,
    })
  );

  await prisma.file.delete({ where: { id: fileId } });

  return NextResponse.json({ message: 'File deleted' });
}
