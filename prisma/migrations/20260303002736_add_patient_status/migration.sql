-- CreateEnum
CREATE TYPE "PatientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED', 'DISCHARGED');

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "status" "PatientStatus" NOT NULL DEFAULT 'ACTIVE';
