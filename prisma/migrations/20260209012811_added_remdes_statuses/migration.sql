/*
  Warnings:

  - The `status` column on the `reminders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "reminders" DROP COLUMN "status",
ADD COLUMN     "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING';
