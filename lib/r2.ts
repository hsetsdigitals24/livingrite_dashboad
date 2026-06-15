// lib/r2.ts
import { S3Client } from '@aws-sdk/client-s3'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

/**
 * Build a permanent, public, non-expiring URL for an R2 object key.
 *
 * Requires the bucket to be publicly readable at `R2_PUBLIC_URL` — either the
 * bucket's r2.dev subdomain or (preferably) a connected custom domain. Swap the
 * env var to migrate hosts; stored URLs that already point at the old host keep
 * working until re-uploaded.
 */
export function r2PublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/+$/, '')
  if (!base) {
    throw new Error(
      'R2_PUBLIC_URL is not set — cannot build a public URL for uploaded files.'
    )
  }
  // Encode each path segment so spaces/special chars in filenames are safe,
  // while preserving the `/` separators in the key.
  const encodedKey = key.split('/').map(encodeURIComponent).join('/')
  return `${base}/${encodedKey}`
}
