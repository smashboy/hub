/*
  Warnings:

  - You are about to drop the column `projectName` on the `FeedbackNotification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeedbackNotification" DROP COLUMN "projectName";

-- AlterTable
ALTER TABLE "ProjectRoadmap" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;
