import { NextResponse } from 'next/server'
import { PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2 } from '@/lib/r2'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

// UPLOAD FILES TO R2 AND SAVE METADATA IN DB
export async function POST(
  req: Request,
  { params }: { params: { patientId: string } }
) {
  const formData = await req.formData()
  const file = formData.get('file') as File 
  const patientId = params.patientId;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const key = `${randomUUID()}-${file.name}`

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  )

  const record = await prisma.file.create({
    data: {
      filename: key,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: `${process.env.R2_PUBLIC_URL}/${key}`,
      patientId: patientId || undefined,
    },
  })

  return NextResponse.json(record)
}

// FETCH FILES FOR A PATIENT
export async function GET(
  req: Request,
  { params }: { params: { patientId: string } }
) {
  const patientId = params.patientId

  if (!patientId) {
    return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
  }

  const files = await prisma.file.findMany({
    where: { patientId },
    orderBy: { createdAt: 'desc' },
  })
 console.log('Fetched files for patient:', patientId, files) // Debug log
  return NextResponse.json(files)
}


// DELETE FILES
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const fileId = searchParams.get('fileId')

  if (!fileId) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
  }

  const fileRecord = await prisma.file.findUnique({ where: { id: fileId } })

  if (!fileRecord) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileRecord.filename,
    })
  )

  await prisma.file.delete({ where: { id: fileId } })

  return NextResponse.json({ message: 'File deleted' })
}

// LIST ALL FILES IN R2 (FOR DEBUGGING)
export async function LIST() {
  const response = await r2.send(
    new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME!,
    })
  )

  return NextResponse.json(response.Contents || [])
}