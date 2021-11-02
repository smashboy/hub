/*
  Warnings:

  - You are about to drop the column `isRead` on the `FeedbackNotification` table. All the data in the column will be lost.
  - You are about to drop the column `isSaved` on the `FeedbackNotification` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `NewChangelogNotification` table. All the data in the column will be lost.
  - You are about to drop the column `isSaved` on the `NewChangelogNotification` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `ProjectInvite` table. All the data in the column will be lost.
  - You are about to drop the column `isSaved` on the `ProjectInvite` table. All the data in the column will be lost.
  - You are about to drop the `Notifications` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[notificationId]` on the table `FeedbackNotification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notificationId]` on the table `NewChangelogNotification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notificationId]` on the table `ProjectInvite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `notificationId` to the `FeedbackNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationId` to the `NewChangelogNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationId` to the `ProjectInvite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FeedbackNotification" DROP CONSTRAINT "FeedbackNotification_notificationsId_fkey";

-- DropForeignKey
ALTER TABLE "NewChangelogNotification" DROP CONSTRAINT "NewChangelogNotification_notificationsId_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInvite" DROP CONSTRAINT "ProjectInvite_notificationsId_fkey";

-- AlterTable
ALTER TABLE "FeedbackNotification" DROP COLUMN "isRead",
DROP COLUMN "isSaved",
ADD COLUMN     "notificationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "NewChangelogNotification" DROP COLUMN "isRead",
DROP COLUMN "isSaved",
ADD COLUMN     "notificationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProjectInvite" DROP COLUMN "isRead",
DROP COLUMN "isSaved",
ADD COLUMN     "notificationId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Notifications";

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isSaved" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackNotification_notificationId_key" ON "FeedbackNotification"("notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "NewChangelogNotification_notificationId_key" ON "NewChangelogNotification"("notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectInvite_notificationId_key" ON "ProjectInvite"("notificationId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackNotification" ADD CONSTRAINT "FeedbackNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewChangelogNotification" ADD CONSTRAINT "NewChangelogNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInvite" ADD CONSTRAINT "ProjectInvite_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
