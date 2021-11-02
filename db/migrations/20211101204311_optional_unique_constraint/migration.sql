-- DropForeignKey
ALTER TABLE "FeedbackNotification" DROP CONSTRAINT "FeedbackNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "NewChangelogNotification" DROP CONSTRAINT "NewChangelogNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInvite" DROP CONSTRAINT "ProjectInvite_notificationId_fkey";

-- AlterTable
ALTER TABLE "FeedbackNotification" ALTER COLUMN "notificationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "NewChangelogNotification" ALTER COLUMN "notificationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProjectInvite" ALTER COLUMN "notificationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "FeedbackNotification" ADD CONSTRAINT "FeedbackNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewChangelogNotification" ADD CONSTRAINT "NewChangelogNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInvite" ADD CONSTRAINT "ProjectInvite_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
