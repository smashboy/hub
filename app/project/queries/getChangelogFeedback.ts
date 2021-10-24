import { authorizePipe } from "app/guard/helpers"
import { resolver } from "blitz"
import db from "db"
import { GetChangelogFeedback } from "../validations"

export default resolver.pipe(
  resolver.zod(GetChangelogFeedback),
  authorizePipe("read", "project.changelog.feedback", ({ projectSlug }) => projectSlug),
  async ({ changelogId }) => {
    const feedback = await db.changelogFeedback.findMany({
      where: {
        changelogId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        rating: true,
        description: true,
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    })

    return feedback
  }
)
