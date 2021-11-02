/*
  Warnings:

  - You are about to drop the column `userId` on the `ProjectInvite` table. All the data in the column will be lost.
  - Added the required column `notifiactionsId` to the `ProjectInvite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectInvite" DROP CONSTRAINT "ProjectInvite_userId_fkey";

-- AlterTable
ALTER TABLE "ProjectInvite" DROP COLUMN "userId",
ADD COLUMN     "notifiactionsId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Notifiactions" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notifiactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignedToFeedbackNotification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "notifiactionsId" INTEGER NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "feedbackId" INTEGER NOT NULL,

    CONSTRAINT "AssignedToFeedbackNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackStatusChangedNotification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "notifiactionsId" INTEGER NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "feedbackId" INTEGER NOT NULL,

    CONSTRAINT "FeedbackStatusChangedNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackAddedToRoadmapNotification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "notifiactionsId" INTEGER NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "roadmapSlug" TEXT NOT NULL,

    CONSTRAINT "FeedbackAddedToRoadmapNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewFeedbackMessageNotification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "notifiactionsId" INTEGER NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "feedbackId" INTEGER NOT NULL,

    CONSTRAINT "NewFeedbackMessageNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewChangelogNotification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "notifiactionsId" INTEGER NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "changelogSlug" INTEGER NOT NULL,

    CONSTRAINT "NewChangelogNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notifiactions_userId_key" ON "Notifiactions"("userId");

-- AddForeignKey
ALTER TABLE "Notifiactions" ADD CONSTRAINT "Notifiactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedToFeedbackNotification" ADD CONSTRAINT "AssignedToFeedbackNotification_notifiactionsId_fkey" FOREIGN KEY ("notifiactionsId") REFERENCES "Notifiactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackStatusChangedNotification" ADD CONSTRAINT "FeedbackStatusChangedNotification_notifiactionsId_fkey" FOREIGN KEY ("notifiactionsId") REFERENCES "Notifiactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackAddedToRoadmapNotification" ADD CONSTRAINT "FeedbackAddedToRoadmapNotification_notifiactionsId_fkey" FOREIGN KEY ("notifiactionsId") REFERENCES "Notifiactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewFeedbackMessageNotification" ADD CONSTRAINT "NewFeedbackMessageNotification_notifiactionsId_fkey" FOREIGN KEY ("notifiactionsId") REFERENCES "Notifiactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewChangelogNotification" ADD CONSTRAINT "NewChangelogNotification_notifiactionsId_fkey" FOREIGN KEY ("notifiactionsId") REFERENCES "Notifiactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInvite" ADD CONSTRAINT "ProjectInvite_notifiactionsId_fkey" FOREIGN KEY ("notifiactionsId") REFERENCES "Notifiactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
