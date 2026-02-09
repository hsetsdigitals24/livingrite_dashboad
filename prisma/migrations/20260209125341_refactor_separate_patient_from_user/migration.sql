/*
  Warnings:

  - You are about to drop the column `userId` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `lab_results` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `medical_appointments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `vitals` table. All the data in the column will be lost.
  - You are about to drop the `patient_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_patient_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[patientId,date]` on the table `daily_logs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientId` to the `daily_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `lab_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `medical_appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `vitals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_patientId_fkey";

-- DropForeignKey
ALTER TABLE "daily_logs" DROP CONSTRAINT "daily_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "lab_results" DROP CONSTRAINT "lab_results_userId_fkey";

-- DropForeignKey
ALTER TABLE "medical_appointments" DROP CONSTRAINT "medical_appointments_userId_fkey";

-- DropForeignKey
ALTER TABLE "patient_caregiver_assignments" DROP CONSTRAINT "patient_caregiver_assignments_patientId_fkey";

-- DropForeignKey
ALTER TABLE "patient_profiles" DROP CONSTRAINT "patient_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_patient_assignments" DROP CONSTRAINT "user_patient_assignments_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "vitals" DROP CONSTRAINT "vitals_userId_fkey";

-- DropIndex
DROP INDEX "daily_logs_userId_date_key";

-- DropIndex
DROP INDEX "daily_logs_userId_idx";

-- DropIndex
DROP INDEX "lab_results_userId_idx";

-- DropIndex
DROP INDEX "medical_appointments_userId_idx";

-- DropIndex
DROP INDEX "vitals_userId_idx";

-- AlterTable
ALTER TABLE "daily_logs" DROP COLUMN "userId",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "lab_results" DROP COLUMN "userId",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "medical_appointments" DROP COLUMN "userId",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vitals" DROP COLUMN "userId",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- DropTable
DROP TABLE "patient_profiles";

-- DropTable
DROP TABLE "user_patient_assignments";

-- DropTable
DROP TABLE "user_profiles";

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "image" TEXT,
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

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_member_assignments" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "accessLevel" "AccessLevel" NOT NULL DEFAULT 'VIEW',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_member_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE INDEX "family_member_assignments_patientId_idx" ON "family_member_assignments"("patientId");

-- CreateIndex
CREATE INDEX "family_member_assignments_clientId_idx" ON "family_member_assignments"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "family_member_assignments_patientId_clientId_key" ON "family_member_assignments"("patientId", "clientId");

-- CreateIndex
CREATE INDEX "daily_logs_patientId_idx" ON "daily_logs"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_logs_patientId_date_key" ON "daily_logs"("patientId", "date");

-- CreateIndex
CREATE INDEX "lab_results_patientId_idx" ON "lab_results"("patientId");

-- CreateIndex
CREATE INDEX "medical_appointments_patientId_idx" ON "medical_appointments"("patientId");

-- CreateIndex
CREATE INDEX "vitals_patientId_idx" ON "vitals"("patientId");

-- AddForeignKey
ALTER TABLE "family_member_assignments" ADD CONSTRAINT "family_member_assignments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_member_assignments" ADD CONSTRAINT "family_member_assignments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_caregiver_assignments" ADD CONSTRAINT "patient_caregiver_assignments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vitals" ADD CONSTRAINT "vitals_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_appointments" ADD CONSTRAINT "medical_appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
