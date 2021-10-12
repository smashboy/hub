-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('ON_REVIEW', 'PLANNED', 'IN_PROGRESS', 'BLOCKED', 'CANCELED', 'COMPLETED');

-- AlterTable
ALTER TABLE "ProjectFeedbackContent" ADD COLUMN     "status" "FeedbackStatus" NOT NULL DEFAULT E'ON_REVIEW';
