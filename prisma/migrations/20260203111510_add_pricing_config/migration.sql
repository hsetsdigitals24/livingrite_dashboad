/*
  Warnings:

  - You are about to drop the `VerificationCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "services" ADD COLUMN     "pricingConfig" JSONB;

-- DropTable
DROP TABLE "VerificationCode";
