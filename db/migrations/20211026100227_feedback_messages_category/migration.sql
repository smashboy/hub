/*
  Warnings:

  - You are about to drop the column `isPublic` on the `ProjectFeedbackMessage` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FeedbackMessageCategory" AS ENUM ('PUBLIC', 'PRIVATE', 'INTERNAL');

-- AlterTable
ALTER TABLE "ProjectFeedbackMessage" DROP COLUMN "isPublic",
ADD COLUMN     "category" "FeedbackMessageCategory" NOT NULL DEFAULT E'PUBLIC';
