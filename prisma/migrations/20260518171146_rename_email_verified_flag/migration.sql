/*
  Warnings:

  - You are about to drop the column `emailVerificaion` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerificaion",
ADD COLUMN     "emailVerifiedFlag" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");
