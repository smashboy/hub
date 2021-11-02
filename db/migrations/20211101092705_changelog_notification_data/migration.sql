/*
  Warnings:

  - Added the required column `projectName` to the `NewChangelogNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `NewChangelogNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NewChangelogNotification" ADD COLUMN     "previewImageUrl" TEXT,
ADD COLUMN     "projectName" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
