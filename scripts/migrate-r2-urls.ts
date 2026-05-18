/**
 * Rewrites stored R2 URLs from the old public-bucket format
 *   {R2_PUBLIC_URL}/<key>
 * to the new redirector format
 *   /api/files/serve-public/<key>
 *
 * Run dry first to see what would change:
 *   npx tsx scripts/migrate-r2-urls.ts
 * Then apply:
 *   npx tsx scripts/migrate-r2-urls.ts --apply
 *
 * Idempotent — rows already pointing at /api/files/serve-public are skipped.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const APPLY = process.argv.includes('--apply');
const PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
const REDIRECTOR_PREFIX = '/api/files/serve-public';

if (!PUBLIC_URL) {
  console.error('R2_PUBLIC_URL is not set. Aborting.');
  process.exit(1);
}

function rewrite(url: string | null | undefined): string | null {
  if (!url) return null;
  if (!url.startsWith(PUBLIC_URL + '/')) return null;
  const key = url.slice(PUBLIC_URL.length + 1);
  return `${REDIRECTOR_PREFIX}/${key}`;
}

type Counter = { scanned: number; rewritten: number; samples: string[] };
const counter = (): Counter => ({ scanned: 0, rewritten: 0, samples: [] });

function record(c: Counter, before: string, after: string) {
  c.scanned++;
  c.rewritten++;
  if (c.samples.length < 3) c.samples.push(`${before}\n    → ${after}`);
}

async function migrateScalar<TWhere extends Record<string, unknown>>(
  label: string,
  delegate: {
    findMany: (args: { where: TWhere; select: Record<string, true> }) => Promise<any[]>;
    update: (args: { where: any; data: any }) => Promise<any>;
  },
  field: string,
  whereContains: TWhere
): Promise<Counter> {
  const c = counter();
  const rows = await delegate.findMany({
    where: whereContains,
    select: { id: true, [field]: true } as any,
  });
  for (const row of rows) {
    const before = row[field] as string;
    const after = rewrite(before);
    if (!after) continue;
    record(c, before, after);
    if (APPLY) {
      await delegate.update({ where: { id: row.id }, data: { [field]: after } });
    }
  }
  console.log(
    `  ${label}.${field}: ${c.rewritten} rewritten` +
      (c.samples.length ? `\n    sample:\n    ${c.samples[0]}` : '')
  );
  return c;
}

async function migrateStringArray(
  label: string,
  delegate: {
    findMany: (args: any) => Promise<any[]>;
    update: (args: any) => Promise<any>;
  },
  field: string
): Promise<Counter> {
  const c = counter();
  const rows = await delegate.findMany({
    where: { [field]: { hasSome: undefined } } as any,
    select: { id: true, [field]: true } as any,
  });
  for (const row of rows) {
    const arr = (row[field] as string[]) || [];
    let changed = false;
    const next = arr.map((u) => {
      const r = rewrite(u);
      if (r) {
        changed = true;
        record(c, u, r);
        return r;
      }
      return u;
    });
    if (changed && APPLY) {
      await delegate.update({ where: { id: row.id }, data: { [field]: next } });
    } else if (changed) {
      // still count for dry-run
    }
  }
  console.log(
    `  ${label}.${field}[]: ${c.rewritten} rewritten` +
      (c.samples.length ? `\n    sample:\n    ${c.samples[0]}` : '')
  );
  return c;
}

async function main() {
  console.log(
    `Migrating R2 URLs prefixed with: ${PUBLIC_URL}\n` +
      `Mode: ${APPLY ? 'APPLY (will write)' : 'dry-run (no writes)'}\n`
  );

  const startsWith = { startsWith: PUBLIC_URL + '/' };

  // User.image
  await migrateScalar('User', prisma.user as any, 'image', { image: startsWith } as any);

  // Patient.image
  await migrateScalar('Patient', prisma.patient as any, 'image', {
    image: startsWith,
  } as any);

  // LandingPagePopup.imageUrl
  await migrateScalar('LandingPagePopup', prisma.landingPagePopup as any, 'imageUrl', {
    imageUrl: startsWith,
  } as any);

  // CaseStudy scalar image fields
  await migrateScalar('CaseStudy', prisma.caseStudy as any, 'heroImage', {
    heroImage: startsWith,
  } as any);
  await migrateScalar('CaseStudy', prisma.caseStudy as any, 'beforeImage', {
    beforeImage: startsWith,
  } as any);
  await migrateScalar('CaseStudy', prisma.caseStudy as any, 'afterImage', {
    afterImage: startsWith,
  } as any);
  await migrateScalar('CaseStudy', prisma.caseStudy as any, 'videoUrl', {
    videoUrl: startsWith,
  } as any);

  // CaseStudy.images[] (Postgres string[] — Prisma can't filter on element
  // prefix, so we scan all rows that have non-empty arrays).
  await migrateStringArray('CaseStudy', prisma.caseStudy as any, 'images');

  console.log(
    `\n${APPLY ? 'Done. Rows updated above.' : 'Dry-run complete. Re-run with --apply to write.'}`
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
