import { resolver, paginate } from "blitz"
import db, { Prisma, ProjectMemberRole } from "db"

export interface GetProjectsInput extends Pick<Prisma.ProjectFindManyArgs, "skip" | "take"> {
  userCreated: boolean
}

export default resolver.pipe(
  async ({ userCreated, skip = 0, take = 25 }: GetProjectsInput, ctx) => {
    const authUserId = ctx.session.userId!

    const where = userCreated
      ? {
          members: {
            some: {
              userId: authUserId,
              role: ProjectMemberRole.FOLLOWER,
            },
          },
        }
      : {
          OR: [
            {
              members: {
                some: {
                  userId: authUserId,
                  role: ProjectMemberRole.CREATOR,
                },
              },
            },
            {
              members: {
                some: {
                  userId: authUserId,
                  role: ProjectMemberRole.ADMIN,
                },
              },
            },
            {
              members: {
                some: {
                  userId: authUserId,
                  role: ProjectMemberRole.MODERATOR,
                },
              },
            },
          ],
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
