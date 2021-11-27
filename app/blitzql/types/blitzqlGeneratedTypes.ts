import { Prisma } from "@prisma/client"

export interface BlitzqlInputSchema {
  authUser: Prisma.UserFindFirstArgs
  authUserNotifications: Prisma.NotificationFindManyArgs
  authUserFeedback: Prisma.ProjectFeedbackFindManyArgs
  authUserProjectsList: Prisma.ProjectFindManyArgs
  changelogFeedback: Prisma.ChangelogFeedbackFindManyArgs
  projectChangelogList: Prisma.ProjectChangelogFindManyArgs
  projectFeedbackContent: Prisma.ProjectFeedbackContentFindFirstArgs
  projectFeedbackList: Prisma.ProjectFeedbackFindManyArgs
  projectFeedbackMessage: Prisma.ProjectFeedbackMessageFindManyArgs
  project: Prisma.ProjectFindFirstArgs
  projectMembersList: Prisma.ProjectMemberFindManyArgs
}

interface QueryOutputHelper<I> {
  authUser: Prisma.UserGetPayload<I>
  authUserNotifications: Array<Prisma.NotificationGetPayload<I>>
  authUserFeedback: Array<Prisma.ProjectFeedbackGetPayload<I>>
  authUserProjectsList: Array<Prisma.ProjectGetPayload<I>>
  changelogFeedback: Array<Prisma.ChangelogFeedbackGetPayload<I>>
  projectChangelogList: Array<Prisma.ProjectChangelogGetPayload<I>>
  projectFeedbackContent: Prisma.ProjectFeedbackContentGetPayload<I>
  projectFeedbackList: Array<Prisma.ProjectFeedbackGetPayload<I>>
  projectFeedbackMessage: Array<Prisma.ProjectFeedbackMessageGetPayload<I>>
  project: Prisma.ProjectGetPayload<I>
  projectMembersList: Array<Prisma.ProjectMemberGetPayload<I>>
}

export type BlitzqlOutputSchema<I, K = keyof I> = {
  // @ts-ignore
  [k in K]: QueryOutputHelper<I[k]>[k]
}
