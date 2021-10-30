/*
  Warnings:

  - You are about to drop the `AssignedToFeedbackNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeedbackAddedToRoadmapNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeedbackStatusChangedNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NewFeedbackMessageNotification` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FeedbackNotificationType" AS ENUM ('ASSIGNED', 'STATUS_CHANGED', 'ADDED_TO_ROADMAP', 'NEW_PUBLIC_MESSAGE', 'NEW_PRIVATE_MESSAGE', 'NEW_INTERNAL_MESSAGE');

-- DropForeignKey
ALTER TABLE "AssignedToFeedbackNotification" DROP CONSTRAINT "AssignedToFeedbackNotification_notificationsId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackAddedToRoadmapNotification" DROP CONSTRAINT "FeedbackAddedToRoadmapNotification_notificationsId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackStatusChangedNotification" DROP CONSTRAINT "FeedbackStatusChangedNotification_notificationsId_fkey";

-- DropForeignKey
ALTER TABLE "NewFeedbackMessageNotification" DROP CONSTRAINT "NewFeedbackMessageNotification_notificationsId_fkey";

-- DropTable
DROP TABLE "AssignedToFeedbackNotification";

-- DropTable
DROP TABLE "FeedbackAddedToRoadmapNotification";

-- DropTable
DROP TABLE "FeedbackStatusChangedNotification";

-- DropTable
DROP TABLE "NewFeedbackMessageNotification";

-- CreateTable
CREATE TABLE "FeedbackNotification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isSaved" BOOLEAN NOT NULL DEFAULT false,
    "type" "FeedbackNotificationType" NOT NULL,
    "notificationsId" INTEGER NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "feedbackTitle" TEXT NOT NULL,
    "newStatus" "FeedbackStatus",
    "feedbackId" INTEGER NOT NULL,

    CONSTRAINT "FeedbackNotification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeedbackNotification" ADD CONSTRAINT "FeedbackNotification_notificationsId_fkey" FOREIGN KEY ("notificationsId") REFERENCES "Notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
