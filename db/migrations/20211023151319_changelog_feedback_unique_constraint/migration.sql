/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `ChangelogFeedback` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChangelogFeedback_id_userId_key" ON "ChangelogFeedback"("id", "userId");
