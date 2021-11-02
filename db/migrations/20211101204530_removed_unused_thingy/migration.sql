/*
  Warnings:

  - You are about to drop the column `notificationsId` on the `FeedbackNotification` table. All the data in the column will be lost.
  - You are about to drop the column `notificationsId` on the `NewChangelogNotification` table. All the data in the column will be lost.
  - You are about to drop the column `notificationsId` on the `ProjectInvite` table. All the data in the column will be lost.
  - Made the column `notificationId` on table `FeedbackNotification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notificationId` on table `NewChangelogNotification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notificationId` on table `ProjectInvite` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FeedbackNotification" DROP CONSTRAINT "FeedbackNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "NewChangelogNotification" DROP CONSTRAINT "NewChangelogNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInvite" DROP CONSTRAINT "ProjectInvite_notificationId_fkey";

-- AlterTable
ALTER TABLE "FeedbackNotification" DROP COLUMN "notificationsId",
ALTER COLUMN "notificationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "NewChangelogNotification" DROP COLUMN "notificationsId",
ALTER COLUMN "notificationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProjectInvite" DROP COLUMN "notificationsId",
ALTER COLUMN "notificationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "FeedbackNotification" ADD CONSTRAINT "FeedbackNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewChangelogNotification" ADD CONSTRAINT "NewChangelogNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInvite" ADD CONSTRAINT "ProjectInvite_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
