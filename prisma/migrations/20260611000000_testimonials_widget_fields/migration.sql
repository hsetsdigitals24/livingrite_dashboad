-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "clientLocation" TEXT,
ADD COLUMN     "shortQuote" TEXT,
ADD COLUMN     "showOnWidget" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "testimonials_showOnWidget_idx" ON "testimonials"("showOnWidget");
