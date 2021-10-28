import { resolver, paginate } from "blitz"
import db, { Prisma } from "db"

export interface GetProjectsInput extends Pick<Prisma.ProjectFindManyArgs, "skip" | "take"> {
  searchQuery?: string
}

export default resolver.pipe(
  async ({ skip = 0, take = 10, searchQuery }: GetProjectsInput, ctx) => {
    const authUserId = ctx.session.userId!

    const defaultQuery = [
      {
        members: {
          some: {
            userId: authUserId,
          },
        },
      },
      {
        followers: {
          some: {
            id: authUserId,
          },
        },
      },
    ]

    const searchQueryOptions = searchQuery
      ? [
          {
            OR: [
              {
                name: {
                  contains: searchQuery,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                description: {
                  contains: searchQuery,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            ],
          },
        ]
      : []

    const where: Prisma.ProjectWhereInput = {
      AND: [{ OR: defaultQuery }, ...searchQueryOptions],
    }

    const {
      items: projects,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () =>
        db.project.count({
          where,
        }),
      query: (paginateArgs) =>
        db.project.findMany({
          ...paginateArgs,
          where,
          select: {
            name: true,
            color: true,
            slug: true,
            logoUrl: true,
            description: true,
            members: {
              where: {
                userId: authUserId,
              },
              select: {
                role: true,
              },
            },
          },
        }),
    })

    return {
      projects,
      nextPage,
      hasMore,
      count,
    }
  }
)
