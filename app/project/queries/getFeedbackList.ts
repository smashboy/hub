import db, { Prisma } from "db"
import { resolver, paginate } from "blitz"

export interface GetFeedbackListInput
  extends Pick<Prisma.ProjectFeedbackFindManyArgs, "skip" | "take" | "where" | "orderBy"> {
  slug: string
}

export default resolver.pipe(
  async ({ skip = 0, take = 10, where, orderBy, slug }: GetFeedbackListInput) => {
    where = {
      ...where,
      projectSlug: slug,
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
            participants: {
              select: {
                user: {
                  select: {
                    username: true,
                    avatarUrl: true,
                  },
                },
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
  }
)
