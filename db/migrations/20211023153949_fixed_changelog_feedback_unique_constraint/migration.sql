/*
  Warnings:

  - A unique constraint covering the columns `[userId,changelogId]` on the table `ChangelogFeedback` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ChangelogFeedback_id_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ChangelogFeedback_userId_changelogId_key" ON "ChangelogFeedback"("userId", "changelogId");
