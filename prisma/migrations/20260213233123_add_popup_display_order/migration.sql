-- AlterTable
ALTER TABLE "landing_page_popups" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "landing_page_popups_displayOrder_idx" ON "landing_page_popups"("displayOrder");
