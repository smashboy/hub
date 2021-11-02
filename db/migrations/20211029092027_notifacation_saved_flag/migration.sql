-- AlterTable
ALTER TABLE "AssignedToFeedbackNotification" ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FeedbackAddedToRoadmapNotification" ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FeedbackStatusChangedNotification" ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "NewChangelogNotification" ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "NewFeedbackMessageNotification" ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProjectInvite" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false;
