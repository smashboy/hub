import db from "db"
import { resolver } from "blitz"
import { CreateFeedback } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(CreateFeedback),
  Guard.authorizePipe("create", "feedback"),
  async ({ projectSlug, title, category, content, participants, roadmaps, labels }, ctx) => {
    const authUserId = ctx.session.userId!

    title = title.trim()

    const feedback = await db.projectFeedback.create({
      data: {
        title,
        category,
        content,
        author: {
          connect: {
            id: authUserId,
          },
        },
        project: {
          connect: {
            slug: projectSlug,
          },
        },
        labels: {
          connect: labels.map((id) => ({ id })),
        },
        participants: {
          connect: participants.map((id) => ({ id })),
        },
        roadmaps: {
          connect: roadmaps.map((id) => ({ id })),
        },
      },
      select: {
        id: true,
      },
    })

    return feedback
  }
)
