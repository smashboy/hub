import db, { Prisma } from "db"
import { resolver, paginate } from "blitz"

export interface GetFeedbackListInput extends Pick<Prisma.ProjectFindManyArgs, "skip" | "take"> {
  slug: string
  searchQuery?: string
}

const orderBy: Prisma.ProjectFeedbackOrderByWithRelationInput = {
  createdAt: "desc",
}

export default resolver.pipe(
  async ({ skip = 0, take = 10, searchQuery, slug }: GetFeedbackListInput) => {
    const where: Prisma.ProjectFeedbackWhereInput = {
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
  }
)
