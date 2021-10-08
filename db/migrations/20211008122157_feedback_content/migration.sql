/*
  Warnings:

  - Added the required column `content` to the `ProjectFeedback` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `ProjectFeedback` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('BUG', 'FEATURE', 'IMPROVEMENT');

-- AlterTable
ALTER TABLE "ProjectFeedback" ADD COLUMN     "content" TEXT NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "FeedbackCategory" NOT NULL;

-- DropEnum
DROP TYPE "FeedbackType";
