-- CreateTable
CREATE TABLE "ChangelogFeedback" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "description" TEXT,
    "changelogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ChangelogFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChangelogFeedback" ADD CONSTRAINT "ChangelogFeedback_changelogId_fkey" FOREIGN KEY ("changelogId") REFERENCES "ProjectChangelog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangelogFeedback" ADD CONSTRAINT "ChangelogFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
