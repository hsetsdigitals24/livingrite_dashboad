/*
  Warnings:

  - You are about to drop the `invitations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "invitations";

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);
