-- DropForeignKey
ALTER TABLE "ChangelogFeedback" DROP CONSTRAINT "ChangelogFeedback_changelogId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectChangelog" DROP CONSTRAINT "ProjectChangelog_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectFeedback" DROP CONSTRAINT "ProjectFeedback_projectSlug_fkey";

-- DropForeignKey
ALTER TABLE "ProjectFeedbackLabel" DROP CONSTRAINT "ProjectFeedbackLabel_settingsId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectFeedbackMessage" DROP CONSTRAINT "ProjectFeedbackMessage_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInvite" DROP CONSTRAINT "ProjectInvite_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInvite" DROP CONSTRAINT "ProjectInvite_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectLanding" DROP CONSTRAINT "ProjectLanding_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectRoadmap" DROP CONSTRAINT "ProjectRoadmap_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectSettings" DROP CONSTRAINT "ProjectSettings_projectId_fkey";

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInvite" ADD CONSTRAINT "ProjectInvite_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInvite" ADD CONSTRAINT "ProjectInvite_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLanding" ADD CONSTRAINT "ProjectLanding_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChangelog" ADD CONSTRAINT "ProjectChangelog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangelogFeedback" ADD CONSTRAINT "ChangelogFeedback_changelogId_fkey" FOREIGN KEY ("changelogId") REFERENCES "ProjectChangelog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRoadmap" ADD CONSTRAINT "ProjectRoadmap_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFeedback" ADD CONSTRAINT "ProjectFeedback_projectSlug_fkey" FOREIGN KEY ("projectSlug") REFERENCES "Project"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFeedbackMessage" ADD CONSTRAINT "ProjectFeedbackMessage_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "ProjectFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSettings" ADD CONSTRAINT "ProjectSettings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFeedbackLabel" ADD CONSTRAINT "ProjectFeedbackLabel_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "ProjectSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
