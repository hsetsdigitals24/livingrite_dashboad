/*
  Warnings:

  - You are about to drop the `payment_attempts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refund_requests` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientId` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "payment_attempts" DROP CONSTRAINT "payment_attempts_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "refund_requests" DROP CONSTRAINT "refund_requests_paymentId_fkey";

-- DropIndex
DROP INDEX "invoices_bookingId_key";

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "markedPaidAt" TIMESTAMP(3),
ADD COLUMN     "markedPaidBy" TEXT,
ADD COLUMN     "patientId" TEXT,
ADD COLUMN     "paymentNote" TEXT,
ADD COLUMN     "servicesData" JSONB,
ALTER COLUMN "bookingId" DROP NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'NGN';

-- DropTable
DROP TABLE "payment_attempts";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "refund_requests";

-- CreateTable
CREATE TABLE "admin_settings" (
    "id" TEXT NOT NULL,
    "paymentAccountName" TEXT,
    "paymentAccountNumber" TEXT,
    "paymentBankName" TEXT,
    "paymentBankCode" TEXT,
    "paymentCurrency" TEXT NOT NULL DEFAULT 'NGN',
    "paymentInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "invoices_clientId_idx" ON "invoices"("clientId");

-- CreateIndex
CREATE INDEX "invoices_bookingId_idx" ON "invoices"("bookingId");

-- CreateIndex
CREATE INDEX "invoices_patientId_idx" ON "invoices"("patientId");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
