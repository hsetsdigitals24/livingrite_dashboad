/*
  Warnings:

  - Added the required column `popupCount` to the `landing_page_popups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "landing_page_popups" ADD COLUMN     "popupCount" INTEGER NOT NULL;
