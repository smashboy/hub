-- DropForeignKey
ALTER TABLE "ChangelogFeedback" DROP CONSTRAINT "ChangelogFeedback_userId_fkey";

-- AlterTable
ALTER TABLE "ChangelogFeedback" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ChangelogFeedback" ADD CONSTRAINT "ChangelogFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
