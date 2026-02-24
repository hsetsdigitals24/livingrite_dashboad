-- CreateEnum
CREATE TYPE "CaregiverTitle" AS ENUM ('DR', 'RN');

-- AlterTable
ALTER TABLE "caregiver_profiles" ADD COLUMN     "title" "CaregiverTitle" NOT NULL DEFAULT 'RN';
