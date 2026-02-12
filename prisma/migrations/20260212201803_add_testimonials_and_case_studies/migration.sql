/*
  Warnings:

  - You are about to drop the column `approvedById` on the `case_studies` table. All the data in the column will be lost.
  - You are about to drop the column `clientAge` on the `case_studies` table. All the data in the column will be lost.
  - You are about to drop the column `clientImage` on the `case_studies` table. All the data in the column will be lost.
  - You are about to drop the column `clientRole` on the `case_studies` table. All the data in the column will be lost.
  - You are about to drop the column `galleryImages` on the `case_studies` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `case_studies` table. All the data in the column will be lost.
  - You are about to drop the column `approvedById` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `clientEmail` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `testimonials` table. All the data in the column will be lost.
  - Made the column `challenge` on table `case_studies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `solution` on table `case_studies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `outcome` on table `case_studies` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "case_studies" DROP CONSTRAINT "case_studies_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_approvedById_fkey";

-- AlterTable
ALTER TABLE "case_studies" DROP COLUMN "approvedById",
DROP COLUMN "clientAge",
DROP COLUMN "clientImage",
DROP COLUMN "clientRole",
DROP COLUMN "galleryImages",
DROP COLUMN "subtitle",
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "keyResults" JSONB,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "timeline" TEXT,
ALTER COLUMN "challenge" SET NOT NULL,
ALTER COLUMN "solution" SET NOT NULL,
ALTER COLUMN "outcome" SET NOT NULL,
ALTER COLUMN "displayOrder" DROP NOT NULL,
ALTER COLUMN "displayOrder" DROP DEFAULT;

-- AlterTable
ALTER TABLE "testimonials" DROP COLUMN "approvedById",
DROP COLUMN "clientEmail",
DROP COLUMN "title",
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "clientTitle" TEXT,
ALTER COLUMN "rating" DROP DEFAULT,
ALTER COLUMN "displayOrder" DROP NOT NULL,
ALTER COLUMN "displayOrder" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "case_studies_slug_idx" ON "case_studies"("slug");

-- CreateIndex
CREATE INDEX "case_studies_createdAt_idx" ON "case_studies"("createdAt");

-- CreateIndex
CREATE INDEX "testimonials_createdAt_idx" ON "testimonials"("createdAt");

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
