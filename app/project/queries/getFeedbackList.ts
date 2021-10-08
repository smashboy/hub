import { resolver, paginate } from "blitz"
import db, { Prisma, ProjectMemberRole } from "db"

export interface GetFeedbackListInput extends Pick<Prisma.ProjectFindManyArgs, "skip" | "take"> {
  slug: string
  searchQuery?: string
}

export default resolver.pipe(
  async ({ skip = 0, take = 10, searchQuery, slug }: GetFeedbackListInput) => {
    const where: Prisma.ProjectFeedbackWhereInput = {
      project: {
        slug,
      },
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
        }),
      query: (paginateArgs) =>
        db.projectFeedback.findMany({
          ...paginateArgs,
          where,
          select: {
            id: true,
            title: true,
            category: true,
            createdAt: true,
            labels: {
              select: {
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
