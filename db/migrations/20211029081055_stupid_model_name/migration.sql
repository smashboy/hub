/*
  Warnings:

  - You are about to drop the column `notifiactionsId` on the `AssignedToFeedbackNotification` table. All the data in the column will be lost.
  - You are about to drop the column `notifiactionsId` on the `FeedbackAddedToRoadmapNotification` table. All the data in the column will be lost.
  - You are about to drop the column `notifiactionsId` on the `FeedbackStatusChangedNotification` table. All the data in the column will be lost.
  - You are about to drop the column `notifiactionsId` on the `NewChangelogNotification` table. All the data in the column will be lost.
  - You are about to drop the column `notifiactionsId` on the `NewFeedbackMessageNotification` table. All the data in the column will be lost.
  - You are about to drop the column `notifiactionsId` on the `ProjectInvite` table. All the data in the column will be lost.
  - You are about to drop the `Notifiactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `notificationsId` to the `AssignedToFeedbackNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationsId` to the `FeedbackAddedToRoadmapNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationsId` to the `FeedbackStatusChangedNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationsId` to the `NewChangelogNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationsId` to the `NewFeedbackMessageNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationsId` to the `ProjectInvite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssignedToFeedbackNotification" DROP CONSTRAINT "AssignedToFeedbackNotification_notifiactionsId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackAddedToRoadmapNotification" DROP CONSTRAINT "FeedbackAddedToRoadmapNotification_notifiactionsId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackStatusChangedNotification" DROP CONSTRAINT "FeedbackStatusChangedNotification_notifiactionsId_fkey";

-- DropForeignKey
ALTER TABLE "NewChangelogNotification" DROP CONSTRAINT "NewChangelogNotification_notifiactionsId_fkey";

-- DropForeignKey
ALTER TABLE "NewFeedbackMessageNotification" DROP CONSTRAINT "NewFeedbackMessageNotification_notifiactionsId_fkey";

-- DropForeignKey
ALTER TABLE "Notifiactions" DROP CONSTRAINT "Notifiactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInvite" DROP CONSTRAINT "ProjectInvite_notifiactionsId_fkey";

-- AlterTable
ALTER TABLE "AssignedToFeedbackNotification" DROP COLUMN "notifiactionsId",
ADD COLUMN     "notificationsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FeedbackAddedToRoadmapNotification" DROP COLUMN "notifiactionsId",
ADD COLUMN     "notificationsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FeedbackStatusChangedNotification" DROP COLUMN "notifiactionsId",
ADD COLUMN     "notificationsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "NewChangelogNotification" DROP COLUMN "notifiactionsId",
ADD COLUMN     "notificationsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "NewFeedbackMessageNotification" DROP COLUMN "notifiactionsId",
ADD COLUMN     "notificationsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProjectInvite" DROP COLUMN "notifiactionsId",
ADD COLUMN     "notificationsId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Notifiactions";

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_userId_key" ON "Notifications"("userId");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedToFeedbackNotification" ADD CONSTRAINT "AssignedToFeedbackNotification_notificationsId_fkey" FOREIGN KEY ("notificationsId") REFERENCES "Notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackStatusChangedNotification" ADD CONSTRAINT "FeedbackStatusChangedNotification_notificationsId_fkey" FOREIGN KEY ("notificationsId") REFERENCES "Notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackAddedToRoadmapNotification" ADD CONSTRAINT "FeedbackAddedToRoadmapNotification_notificationsId_fkey" FOREIGN KEY ("notificationsId") REFERENCES "Notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewFeedbackMessageNotification" ADD CONSTRAINT "NewFeedbackMessageNotification_notificationsId_fkey" FOREIGN KEY ("notificationsId") REFERENCES "Notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewChangelogNotification" ADD CONSTRAINT "NewChangelogNotification_notificationsId_fkey" FOREIGN KEY ("notificationsId") REFERENCES "Notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInvite" ADD CONSTRAINT "ProjectInvite_notificationsId_fkey" FOREIGN KEY ("notificationsId") REFERENCES "Notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
