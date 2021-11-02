import db from "db"
import { resolver } from "blitz"
import { CreateProjectInvites } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(CreateProjectInvites),
  authorizePipe("create", "project.settings.invites", ({ projectSlug }) => projectSlug),
  async ({ projectSlug, usersId }) => {
    const queries = usersId.map((userId) =>
      db.notification.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          projectInvite: {
            create: {
              project: {
                connect: {
                  slug: projectSlug,
                },
              },
            },
          },
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      })
    )
    const newInvites = await db.$transaction(queries)

    return newInvites.map(({ user, ...otherProps }) => ({ ...otherProps, user }))
  }
)
