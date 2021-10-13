-- CreateTable
CREATE TABLE "_ProjectFeedbackToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectFeedbackToUser_AB_unique" ON "_ProjectFeedbackToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectFeedbackToUser_B_index" ON "_ProjectFeedbackToUser"("B");

-- AddForeignKey
ALTER TABLE "_ProjectFeedbackToUser" ADD FOREIGN KEY ("A") REFERENCES "ProjectFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectFeedbackToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
