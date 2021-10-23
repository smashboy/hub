/*
  Warnings:

  - You are about to drop the column `description` on the `ProjectChangelog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,slug]` on the table `ProjectChangelog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ProjectChangelog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectChangelog" DROP COLUMN "description",
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectChangelog_projectId_slug_key" ON "ProjectChangelog"("projectId", "slug");
