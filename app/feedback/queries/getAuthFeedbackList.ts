import db, { Prisma } from "db"
import { resolver, paginate } from "blitz"

export interface GetAuthFeedbackListInput
  extends Pick<Prisma.ProjectFeedbackFindManyArgs, "skip" | "take"> {}

const orderBy: Prisma.ProjectFeedbackOrderByWithRelationInput = {
  createdAt: "desc",
}

export default resolver.pipe(async ({ skip = 0, take = 10 }: GetAuthFeedbackListInput, ctx) => {
  const authUserId = ctx.session.userId!

  const where: Prisma.ProjectFeedbackWhereInput = {
    authorId: authUserId,
  }

  const {
    items: feedback,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,
    count: () =>
      db.projectFeedback.count({
        where,
        orderBy,
      }),
    query: (paginateArgs) =>
      db.projectFeedback.findMany({
        ...paginateArgs,
        where,
        orderBy,
        select: {
          _count: {
            select: {
              upvotedBy: true,
            },
          },
          projectSlug: true,
          content: {
            select: {
              id: true,
              title: true,
              category: true,
              status: true,
            },
          },
          createdAt: true,
          author: {
            select: {
              username: true,
            },
          },
          labels: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      }),
  })

  return {
    feedback,
    nextPage,
    hasMore,
    count,
  }
})
