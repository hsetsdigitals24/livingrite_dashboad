/*
  Warnings:

  - You are about to drop the column `avgHeartRate` on the `workouts` table. All the data in the column will be lost.
  - You are about to drop the column `cadenceAvg` on the `workouts` table. All the data in the column will be lost.
  - You are about to drop the column `elevationGainM` on the `workouts` table. All the data in the column will be lost.
  - You are about to drop the column `maxHeartRate` on the `workouts` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `workouts` table. All the data in the column will be lost.
  - You are about to drop the column `perceivedExertion` on the `workouts` table. All the data in the column will be lost.
  - You are about to drop the column `zone1Minutes` on the `workouts` table. All the data in the column will be lost.
  - You are about to drop the column `zone2Minutes` on the `workouts` table. All the data in the column will be lost.
  - You are about to drop the column `zone3Minutes` on the `workouts` table. All the data in the column will be lost.
  - You are about to drop the column `zone4Minutes` on the `workouts` table. All the data in the column will be lost.
  - You are about to drop the column `zone5Minutes` on the `workouts` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('VIEW', 'EDIT', 'FULL_ACCESS');

-- AlterTable
ALTER TABLE "workouts" DROP COLUMN "avgHeartRate",
DROP COLUMN "cadenceAvg",
DROP COLUMN "elevationGainM",
DROP COLUMN "maxHeartRate",
DROP COLUMN "notes",
DROP COLUMN "perceivedExertion",
DROP COLUMN "zone1Minutes",
DROP COLUMN "zone2Minutes",
DROP COLUMN "zone3Minutes",
DROP COLUMN "zone4Minutes",
DROP COLUMN "zone5Minutes",
ADD COLUMN     "heartRateZone1Minutes" INTEGER,
ADD COLUMN     "heartRateZone2Minutes" INTEGER,
ADD COLUMN     "heartRateZone3Minutes" INTEGER,
ADD COLUMN     "heartRateZone4Minutes" INTEGER,
ADD COLUMN     "heartRateZone5Minutes" INTEGER;

-- CreateTable
CREATE TABLE "caregiver_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "specialization" TEXT[],
    "yearsOfExperience" INTEGER,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caregiver_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "biologicalGender" TEXT,
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "timezone" TEXT,
    "medicalConditions" TEXT[],
    "medications" JSONB,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_caregiver_assignments" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "caregiverId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_caregiver_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_patient_assignments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "accessLevel" "AccessLevel" NOT NULL DEFAULT 'VIEW',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_patient_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_profiles_userId_key" ON "caregiver_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "patient_profiles_userId_key" ON "patient_profiles"("userId");

-- CreateIndex
CREATE INDEX "patient_caregiver_assignments_patientId_idx" ON "patient_caregiver_assignments"("patientId");

-- CreateIndex
CREATE INDEX "patient_caregiver_assignments_caregiverId_idx" ON "patient_caregiver_assignments"("caregiverId");

-- CreateIndex
CREATE UNIQUE INDEX "patient_caregiver_assignments_patientId_caregiverId_key" ON "patient_caregiver_assignments"("patientId", "caregiverId");

-- CreateIndex
CREATE INDEX "user_patient_assignments_userId_idx" ON "user_patient_assignments"("userId");

-- CreateIndex
CREATE INDEX "user_patient_assignments_patientId_idx" ON "user_patient_assignments"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "user_patient_assignments_userId_patientId_key" ON "user_patient_assignments"("userId", "patientId");

-- AddForeignKey
ALTER TABLE "caregiver_profiles" ADD CONSTRAINT "caregiver_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_profiles" ADD CONSTRAINT "patient_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_caregiver_assignments" ADD CONSTRAINT "patient_caregiver_assignments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_caregiver_assignments" ADD CONSTRAINT "patient_caregiver_assignments_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_patient_assignments" ADD CONSTRAINT "user_patient_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
