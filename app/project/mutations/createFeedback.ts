import db from "db"
import { resolver } from "blitz"
import { CreateFeedback } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(CreateFeedback),
  authorizePipe("create", "feedback"),
  async ({ projectSlug, title, category, content, participants, roadmaps, labels }) => {
    title = title.trim()

    const feedback = await db.projectFeedback.create({
      data: {
        title,
        category,
        content,
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
