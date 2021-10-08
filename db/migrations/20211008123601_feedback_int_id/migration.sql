/*
  Warnings:

  - The primary key for the `ProjectFeedback` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProjectFeedback` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `feedbackId` column on the `ProjectFeedbackLabel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `projectFeedbackId` column on the `ProjectMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[A,B]` on the table `_ProjectFeedbackToProjectRoadmap` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `A` on the `_ProjectFeedbackToProjectRoadmap` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ProjectFeedbackLabel" DROP CONSTRAINT "ProjectFeedbackLabel_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_projectFeedbackId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectFeedbackToProjectRoadmap" DROP CONSTRAINT "_ProjectFeedbackToProjectRoadmap_A_fkey";

-- AlterTable
ALTER TABLE "ProjectFeedback" DROP CONSTRAINT "ProjectFeedback_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ProjectFeedback_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProjectFeedbackLabel" DROP COLUMN "feedbackId",
ADD COLUMN     "feedbackId" INTEGER;

-- AlterTable
ALTER TABLE "ProjectMember" DROP COLUMN "projectFeedbackId",
ADD COLUMN     "projectFeedbackId" INTEGER;

-- AlterTable
ALTER TABLE "_ProjectFeedbackToProjectRoadmap" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectFeedbackToProjectRoadmap_AB_unique" ON "_ProjectFeedbackToProjectRoadmap"("A", "B");

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectFeedbackId_fkey" FOREIGN KEY ("projectFeedbackId") REFERENCES "ProjectFeedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFeedbackLabel" ADD CONSTRAINT "ProjectFeedbackLabel_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "ProjectFeedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectFeedbackToProjectRoadmap" ADD FOREIGN KEY ("A") REFERENCES "ProjectFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;
