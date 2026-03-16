-- CreateEnum
CREATE TYPE "CaregiverAllowListStatus" AS ENUM ('APPROVED', 'REJECTED', 'PENDING');

-- CreateTable
CREATE TABLE "caregiver_allow_list" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "CaregiverAllowListStatus" NOT NULL DEFAULT 'APPROVED',
    "addedBy" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caregiver_allow_list_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_allow_list_email_key" ON "caregiver_allow_list"("email");

-- CreateIndex
CREATE INDEX "caregiver_allow_list_email_idx" ON "caregiver_allow_list"("email");

-- CreateIndex
CREATE INDEX "caregiver_allow_list_status_idx" ON "caregiver_allow_list"("status");

-- CreateIndex
CREATE INDEX "caregiver_allow_list_createdAt_idx" ON "caregiver_allow_list"("createdAt");
