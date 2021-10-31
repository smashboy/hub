import db from "db"
import { resolver } from "blitz"
import { UpdateFeedback } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(UpdateFeedback),
  Guard.authorizePipe("update", "feedback"),
  async ({ title, category, content, feedbackId }) => {
    title = title.trim()

    await db.projectFeedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        content: {
          update: {
            title,
            category,
            content,
          },
        },
      },
    })
  }
)
