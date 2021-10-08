-- AlterTable
ALTER TABLE "ProjectFeedback" ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "ProjectFeedback" ADD CONSTRAINT "ProjectFeedback_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
