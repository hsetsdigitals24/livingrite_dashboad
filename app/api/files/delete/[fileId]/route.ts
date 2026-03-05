
import { NextResponse } from 'next/server'
import { DeleteObjectCommand } from '@aws-sdk/client-s3' 
import { prisma } from '@/lib/prisma'

import { r2 } from '@/lib/r2'

const SIGNED_URL_EXPIRY = 3600 // 1 hour in seconds

export async function DELETE(req: Request, { params }: { params: Promise<{ fileId: string }> }) {

  const { fileId } = await params;

  if (!fileId) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
  }

  const fileRecord = await prisma.file.findUnique({ where: { id: fileId } })

  if (!fileRecord) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileRecord.filename,
    })
  )

  await prisma.file.delete({ where: { id: fileId } })

  return NextResponse.json({ message: 'File deleted' })
}