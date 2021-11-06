-- DropForeignKey
ALTER TABLE "ProjectFeedbackContent" DROP CONSTRAINT "ProjectFeedbackContent_projectFeedbackId_fkey";

-- AddForeignKey
ALTER TABLE "ProjectFeedbackContent" ADD CONSTRAINT "ProjectFeedbackContent_projectFeedbackId_fkey" FOREIGN KEY ("projectFeedbackId") REFERENCES "ProjectFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;
