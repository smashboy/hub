/*
  Warnings:

  - A unique constraint covering the columns `[projectFeedbackId]` on the table `ProjectFeedbackContent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProjectFeedbackContent" ADD COLUMN     "projectFeedbackId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectFeedbackContent_projectFeedbackId_key" ON "ProjectFeedbackContent"("projectFeedbackId");

-- AddForeignKey
ALTER TABLE "ProjectFeedbackContent" ADD CONSTRAINT "ProjectFeedbackContent_projectFeedbackId_fkey" FOREIGN KEY ("projectFeedbackId") REFERENCES "ProjectFeedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;
