import db from "db"
import { resolver } from "blitz"
import { SearchUsers } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(SearchUsers),
  authorizePipe("read", "project.settings.invite", ({ projectSlug }) => projectSlug),
  async ({ query, projectSlug }, ctx) => {
    const authUserId = ctx.session.userId!

    const members = await db.projectMember.findMany({
      where: {
        project: {
          slug: projectSlug,
        },
      },
      select: {
        id: true,
      },
    })

    const membersIds = members.map(({ id }) => id)

    let users = await db.user.findMany({
      where: {
        NOT: {
          id: authUserId,
        },
        OR: [
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        email: true,
      },
    })

    users = users.filter(({ id }) => !membersIds.includes(id))

    return users
  }
)
