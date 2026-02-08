-- CreateTable
CREATE TABLE "admin_signup_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedBy" TEXT,
    "usedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "admin_signup_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_signup_codes_code_key" ON "admin_signup_codes"("code");

-- CreateIndex
CREATE INDEX "admin_signup_codes_isUsed_idx" ON "admin_signup_codes"("isUsed");

-- CreateIndex
CREATE INDEX "admin_signup_codes_expiresAt_idx" ON "admin_signup_codes"("expiresAt");
