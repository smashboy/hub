import db from "db"
import { resolver } from "blitz"
import { CreateChangelogFeedback } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(CreateChangelogFeedback),
  Guard.authorizePipe("create", "project.changelog.feedback"),
  async ({ changelogId, rating, description }, ctx) => {
    const authUserId = ctx.session.userId

    await db.changelogFeedback.create({
      data: {
        rating,
        description,
        user: authUserId
          ? {
              connect: {
                id: authUserId,
              },
            }
          : undefined,
        changelog: {
          connect: {
            id: changelogId,
          },
        },
      },
    })
  }
)
