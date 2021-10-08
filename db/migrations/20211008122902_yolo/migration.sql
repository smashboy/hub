/*
  Warnings:

  - You are about to drop the column `roadmapId` on the `ProjectFeedback` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectFeedback" DROP CONSTRAINT "ProjectFeedback_roadmapId_fkey";

-- AlterTable
ALTER TABLE "ProjectFeedback" DROP COLUMN "roadmapId";

-- CreateTable
CREATE TABLE "_ProjectFeedbackToProjectRoadmap" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectFeedbackToProjectRoadmap_AB_unique" ON "_ProjectFeedbackToProjectRoadmap"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectFeedbackToProjectRoadmap_B_index" ON "_ProjectFeedbackToProjectRoadmap"("B");

-- AddForeignKey
ALTER TABLE "_ProjectFeedbackToProjectRoadmap" ADD FOREIGN KEY ("A") REFERENCES "ProjectFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectFeedbackToProjectRoadmap" ADD FOREIGN KEY ("B") REFERENCES "ProjectRoadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
