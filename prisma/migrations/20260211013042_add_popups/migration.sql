-- CreateTable
CREATE TABLE "landing_page_popups" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "actionButtonText" TEXT NOT NULL,
    "actionButtonUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_page_popups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "landing_page_popups_isActive_idx" ON "landing_page_popups"("isActive");
