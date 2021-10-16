import db from "db"
import { resolver } from "blitz"
import { CreateProjectInvites } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(CreateProjectInvites),
  authorizePipe("create", "project.settings.invites", ({ projectSlug }) => projectSlug),
  async ({ projectSlug, usersId }) => {
    const queries = usersId.map((userId) =>
      db.projectInvite.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          project: {
            connect: {
              slug: projectSlug,
            },
          },
        },
      })
    )
    await db.$transaction(queries)
  }
)
