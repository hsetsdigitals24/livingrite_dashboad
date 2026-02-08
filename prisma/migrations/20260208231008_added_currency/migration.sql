/*
  Warnings:

  - You are about to drop the column `clientTimezone` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "clientTimezone",
DROP COLUMN "duration";

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "currency" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT;
