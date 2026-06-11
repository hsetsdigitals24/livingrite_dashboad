-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "followUpSmsSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminderSmsSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "thankYouSmsSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "reminders" ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "maxRetries" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sentAt" TIMESTAMP(3),
ADD COLUMN     "sentVia" TEXT;

-- CreateIndex
CREATE INDEX "reminders_status_idx" ON "reminders"("status");

-- CreateIndex
CREATE INDEX "reminders_scheduledAt_idx" ON "reminders"("scheduledAt");

-- CreateIndex
CREATE INDEX "reminders_type_idx" ON "reminders"("type");
