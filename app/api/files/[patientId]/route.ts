import { NextResponse } from 'next/server'
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/lib/r2'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

const SIGNED_URL_EXPIRY = 3600 // 1 hour in seconds

/**
 * Generates a signed URL for accessing an uploaded file
 * @param key - The S3 object key
 * @param expirySeconds - URL expiration time in seconds (default: 1 hour)
 * @returns Signed URL string
 */
async function getSignedFileUrl(
  key: string,
  expirySeconds: number = SIGNED_URL_EXPIRY
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    })

    const signedUrl = await getSignedUrl(r2, command, {
      expiresIn: expirySeconds,
    })

    return signedUrl
  } catch (error) {
    console.error('Failed to generate signed URL:', error)
    throw new Error('Failed to generate signed URL')
  }
}

// UPLOAD FILES TO R2 AND SAVE METADATA IN DB
export async function POST(
  req: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const formData = await req.formData()
  const file = formData.get('file') as File 
  const { patientId } = await params;

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

  // Generate signed URL
  const signedUrl = await getSignedFileUrl(key)

  const record = await prisma.file.create({
    data: {
      filename: key,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: signedUrl,
      patientId: patientId || undefined,
    },
  })

  return NextResponse.json({
    ...record,
    expiresIn: SIGNED_URL_EXPIRY,
  })
}

// FETCH FILES FOR A PATIENT
export async function GET(
  req: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const { patientId } = await params;

  if (!patientId) {
    return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
  }

  const files = await prisma.file.findMany({
    where: { patientId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(files)
}

