import { resolver, paginate } from "blitz"
import db, { Prisma } from "db"

export interface GetChangelogListInput
  extends Pick<Prisma.ProjectChangelogFindManyArgs, "skip" | "take"> {
  slug: string
}

export default resolver.pipe(async ({ skip = 0, take = 10, slug }: GetChangelogListInput) => {
  const where: Prisma.ProjectChangelogWhereInput = {
    project: {
      slug,
    },
  }

  const orderBy: Prisma.ProjectChangelogOrderByWithRelationInput = {
    createdAt: "desc",
  }

  const {
    items: changelog,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,
    count: () =>
      db.projectChangelog.count({
        where,
        orderBy,
      }),
    query: (paginateArgs) =>
      db.projectChangelog.findMany({
        ...paginateArgs,
        where,
        orderBy,
        select: {
          slug: true,
          createdAt: true,
          title: true,
        },
      }),
  })

  return {
    changelog,
    nextPage,
    hasMore,
    count,
  }
})
