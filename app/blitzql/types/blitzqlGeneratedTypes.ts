import { Prisma } from "@prisma/client"

export interface BlitzqlInputSchema {
  authUser: Prisma.UserFindFirstArgs
  authUserNotificationsCounter: Prisma.NotificationFindManyArgs
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
  authUser: Prisma.UserGetPayload<I> | null
  authUserNotificationsCounter: Array<Prisma.NotificationGetPayload<I>> | null
  authUserFeedback: {
    items: Array<Prisma.ProjectFeedbackGetPayload<I>>
    nextPage: {
      take: number
      skip: number
    } | null
    hasMore: boolean
    count: number
  }
  authUserProjectsList: {
    items: Array<Prisma.ProjectGetPayload<I>>
    nextPage: {
      take: number
      skip: number
    } | null
    hasMore: boolean
    count: number
  }
  changelogFeedback: Array<Prisma.ChangelogFeedbackGetPayload<I>>
  projectChangelogList: {
    items: Array<Prisma.ProjectChangelogGetPayload<I>>
    nextPage: {
      take: number
      skip: number
    } | null
    hasMore: boolean
    count: number
  }
  projectFeedbackContent: Prisma.ProjectFeedbackContentGetPayload<I>
  projectFeedbackList: {
    items: Array<Prisma.ProjectFeedbackGetPayload<I>>
    nextPage: {
      take: number
      skip: number
    } | null
    hasMore: boolean
    count: number
  }
  projectFeedbackMessage: Array<Prisma.ProjectFeedbackMessageGetPayload<I>>
  project: Prisma.ProjectGetPayload<I>
  projectMembersList: Array<Prisma.ProjectMemberGetPayload<I>>
}

export type BlitzqlOutputSchema<I, K = keyof I> = {
  // @ts-ignore
  [k in K]: QueryOutputHelper<I[k]>[k]
}
