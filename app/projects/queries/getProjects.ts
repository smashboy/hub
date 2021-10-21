import { resolver, paginate } from "blitz"
import db, { Prisma } from "db"

export interface GetProjectsInput extends Pick<Prisma.ProjectFindManyArgs, "skip" | "take"> {
  searchQuery?: string
}

export default resolver.pipe(
  async ({ skip = 0, take = 10, searchQuery }: GetProjectsInput, ctx) => {
    const authUserId = ctx.session.userId!

    let where: Prisma.ProjectWhereInput = {
      OR: [
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
      ],
    }

    where = searchQuery
      ? {
          ...where,
          ...{
            OR: [
              // @ts-ignore
              ...where.OR!,
              {
                name: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
            ],
          },
        }
      : where

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
