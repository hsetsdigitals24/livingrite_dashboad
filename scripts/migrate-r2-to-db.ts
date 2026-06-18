/**
 * One-off migration: pull every file out of Cloudflare R2 and store it inline
 * in PostgreSQL as gzip-compressed, base64-encoded bytes.
 *
 * Run this WHILE the R2 credentials still work, before stripping the R2 env
 * vars / uninstalling the AWS SDK.
 *
 * Dry-run first (no writes):
 *   npx tsx scripts/migrate-r2-to-db.ts
 * Then apply:
 *   npx tsx scripts/migrate-r2-to-db.ts --apply
 *
 * Idempotent:
 *   - File rows already carrying inline `data` are skipped.
 *   - Content URL fields already pointing at an id-based serve-public path are
 *     skipped.
 *
 * What it does:
 *   1. File rows (patient docs): download by `filename` key → gzip+base64 →
 *      set `data`, set `url = /api/files/serve/{id}`.
 *   2. Content URL fields (User.image, Patient.image, LandingPagePopup.imageUrl,
 *      CaseStudy.heroImage/beforeImage/afterImage/videoUrl/images[],
 *      TicketAttachment.fileUrl): resolve the R2 key, download bytes, create a
 *      new File row (patientId null) with inline `data`, then rewrite the field
 *      to `/api/files/serve-public/{newId}`.
 */

import { PrismaClient } from '@prisma/client';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { gzipSync } from 'zlib';
import path from 'path';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

const PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
const BUCKET = process.env.R2_BUCKET_NAME!;
const SERVE_PUBLIC_PREFIX = '/api/files/serve-public/';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

function mimeFromKey(key: string): string {
  return MIME_BY_EXT[path.extname(key).toLowerCase()] || 'application/octet-stream';
}

const compress = (buf: Buffer) => gzipSync(buf).toString('base64');

/**
 * Resolve the R2 object key from a stored URL.
 * Handles `{R2_PUBLIC_URL}/<key>` and legacy `/api/files/serve-public/<key>`.
 * Returns null for values that aren't R2 references or are already migrated
 * (id-based serve-public paths — a single segment with no `/` or `.`).
 */
function resolveKey(url: string | null | undefined): string | null {
  if (!url) return null;
  if (PUBLIC_URL && url.startsWith(PUBLIC_URL + '/')) {
    return decodeURIComponent(url.slice(PUBLIC_URL.length + 1));
  }
  if (url.startsWith(SERVE_PUBLIC_PREFIX)) {
    const rest = url.slice(SERVE_PUBLIC_PREFIX.length);
    // Already an id-based path (no key separators / extension) → migrated.
    if (!rest.includes('/') && !rest.includes('.')) return null;
    return rest.split('/').map(decodeURIComponent).join('/');
  }
  return null;
}

async function streamToBuffer(body: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function downloadKey(key: string): Promise<Buffer> {
  const res = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  return streamToBuffer(res.Body);
}

/** Download a key, create a public File row, return its serve-public URL. */
async function inlinePublicAsset(key: string): Promise<string> {
  const buffer = await downloadKey(key);
  const record = await prisma.file.create({
    data: {
      filename: key,
      originalName: path.basename(key),
      mimeType: mimeFromKey(key),
      size: buffer.length,
      data: compress(buffer),
      url: '',
    },
  });
  const url = `${SERVE_PUBLIC_PREFIX}${record.id}`;
  await prisma.file.update({ where: { id: record.id }, data: { url } });
  return url;
}

let migrated = 0;
let skipped = 0;
let failed = 0;

async function migrateContentField(
  label: string,
  delegate: { findMany: (a: any) => Promise<any[]>; update: (a: any) => Promise<any> },
  field: string
) {
  const rows = await delegate.findMany({ select: { id: true, [field]: true } });
  for (const row of rows) {
    const key = resolveKey(row[field]);
    if (!key) {
      skipped++;
      continue;
    }
    try {
      if (APPLY) {
        const url = await inlinePublicAsset(key);
        await delegate.update({ where: { id: row.id }, data: { [field]: url } });
      }
      migrated++;
      console.log(`  ${label}.${field} [${row.id}] ${key} → inlined`);
    } catch (err) {
      failed++;
      console.error(`  ! ${label}.${field} [${row.id}] ${key}: ${(err as Error).message}`);
    }
  }
}

async function migrateStringArrayField(
  label: string,
  delegate: { findMany: (a: any) => Promise<any[]>; update: (a: any) => Promise<any> },
  field: string
) {
  const rows = await delegate.findMany({ select: { id: true, [field]: true } });
  for (const row of rows) {
    const arr: string[] = row[field] || [];
    let changed = false;
    const next: string[] = [];
    for (const u of arr) {
      const key = resolveKey(u);
      if (!key) {
        next.push(u);
        skipped++;
        continue;
      }
      try {
        if (APPLY) {
          next.push(await inlinePublicAsset(key));
        } else {
          next.push(u);
        }
        changed = true;
        migrated++;
        console.log(`  ${label}.${field}[] [${row.id}] ${key} → inlined`);
      } catch (err) {
        next.push(u);
        failed++;
        console.error(`  ! ${label}.${field}[] [${row.id}] ${key}: ${(err as Error).message}`);
      }
    }
    if (changed && APPLY) {
      await delegate.update({ where: { id: row.id }, data: { [field]: next } });
    }
  }
}

async function migratePatientFiles() {
  // File rows still missing inline data — download by their R2 key (filename).
  const rows = await prisma.file.findMany({
    where: { data: null },
    select: { id: true, filename: true, patientId: true },
  });
  for (const row of rows) {
    try {
      const buffer = await downloadKey(row.filename);
      if (APPLY) {
        await prisma.file.update({
          where: { id: row.id },
          data: {
            data: compress(buffer),
            url: row.patientId
              ? `/api/files/serve/${row.id}`
              : `${SERVE_PUBLIC_PREFIX}${row.id}`,
          },
        });
      }
      migrated++;
      console.log(`  File [${row.id}] ${row.filename} → inlined`);
    } catch (err) {
      failed++;
      console.error(`  ! File [${row.id}] ${row.filename}: ${(err as Error).message}`);
    }
  }
}

async function main() {
  console.log(`Migrating R2 files into the database`);
  console.log(`Mode: ${APPLY ? 'APPLY (writing)' : 'dry-run (no writes)'}\n`);

  if (!BUCKET) {
    console.error('R2_BUCKET_NAME is not set. Aborting.');
    process.exit(1);
  }

  console.log('File rows (patient documents):');
  await migratePatientFiles();

  console.log('\nContent URL fields:');
  await migrateContentField('User', prisma.user as any, 'image');
  await migrateContentField('Patient', prisma.patient as any, 'image');
  await migrateContentField('LandingPagePopup', prisma.landingPagePopup as any, 'imageUrl');
  await migrateContentField('CaseStudy', prisma.caseStudy as any, 'heroImage');
  await migrateContentField('CaseStudy', prisma.caseStudy as any, 'beforeImage');
  await migrateContentField('CaseStudy', prisma.caseStudy as any, 'afterImage');
  await migrateContentField('CaseStudy', prisma.caseStudy as any, 'videoUrl');
  await migrateStringArrayField('CaseStudy', prisma.caseStudy as any, 'images');
  await migrateContentField('TicketAttachment', prisma.ticketAttachment as any, 'fileUrl');

  console.log(
    `\n${APPLY ? 'Done.' : 'Dry-run complete. Re-run with --apply to write.'}` +
      ` migrated=${migrated} skipped=${skipped} failed=${failed}`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
