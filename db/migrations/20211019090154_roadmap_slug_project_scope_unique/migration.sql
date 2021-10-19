/*
  Warnings:

  - A unique constraint covering the columns `[projectId,slug]` on the table `ProjectRoadmap` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProjectRoadmap_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRoadmap_projectId_slug_key" ON "ProjectRoadmap"("projectId", "slug");
