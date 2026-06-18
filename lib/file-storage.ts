// lib/file-storage.ts
import { gzipSync, gunzipSync } from 'zlib'

/**
 * In-database file storage helpers.
 *
 * Files are stored directly in PostgreSQL instead of an external object store.
 * To keep the row size down (and offset base64's ~33% overhead) the raw bytes
 * are gzip-compressed first, then base64-encoded for storage in a `Text` column.
 *
 * A gzipped payload is NOT a directly-renderable `data:` URI — files must be
 * read back through the `/api/files/serve/*` endpoints, which call
 * `decompressFromBase64` and stream the raw bytes with the right Content-Type.
 */

/** gzip-compress a buffer, then base64-encode it for storage. */
export function compressToBase64(buf: Buffer): string {
  return gzipSync(buf).toString('base64')
}

/** Reverse of {@link compressToBase64}: base64-decode, then gunzip. */
export function decompressFromBase64(b64: string): Buffer {
  return gunzipSync(Buffer.from(b64, 'base64'))
}
