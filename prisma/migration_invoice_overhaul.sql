-- Migration: Invoice workflow overhaul
-- Run this against your PostgreSQL database

-- 1. Add clientId and services fields to invoices table
ALTER TABLE invoices 
  ADD COLUMN IF NOT EXISTS "clientId" TEXT,
  ADD COLUMN IF NOT EXISTS "services" JSONB,
  ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- 2. Add foreign key for clientId → users
ALTER TABLE invoices 
  ADD CONSTRAINT IF NOT EXISTS "invoices_clientId_fkey" 
  FOREIGN KEY ("clientId") REFERENCES users(id) ON DELETE SET NULL;

-- 3. Add index on clientId
CREATE INDEX IF NOT EXISTS "invoices_clientId_idx" ON invoices("clientId");

-- 4. Create payment_settings table
CREATE TABLE IF NOT EXISTS payment_settings (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "bankName"       TEXT NOT NULL DEFAULT '',
  "accountName"    TEXT NOT NULL DEFAULT '',
  "accountNumber"  TEXT NOT NULL DEFAULT '',
  "bankCode"       TEXT DEFAULT '',
  "additionalInfo" TEXT DEFAULT '',
  "updatedAt"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. Remove bookingId NOT NULL constraint (make it truly optional for client-based invoices)
-- (already optional in schema as String?)

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'invoices' 
AND column_name IN ('clientId', 'services', 'notes');
