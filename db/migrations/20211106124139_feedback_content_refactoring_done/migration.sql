/*
  Warnings:

  - You are about to drop the column `contentId` on the `ProjectFeedback` table. All the data in the column will be lost.
  - Made the column `projectFeedbackId` on table `ProjectFeedbackContent` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProjectFeedback" DROP CONSTRAINT "ProjectFeedback_contentId_projectSlug_fkey";

-- DropIndex
DROP INDEX "ProjectFeedback_contentId_projectSlug_unique";

-- AlterTable
ALTER TABLE "ProjectFeedback" DROP COLUMN "contentId";

-- AlterTable
ALTER TABLE "ProjectFeedbackContent" ALTER COLUMN "projectFeedbackId" SET NOT NULL;
