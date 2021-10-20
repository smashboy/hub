import db from "db"
import { resolver } from "blitz"
import { UpdateFeedbackStatus } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(UpdateFeedbackStatus),
  Guard.authorizePipe("update", "feedback"),
  async ({ feedbackId, status }) => {
    await db.projectFeedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        content: {
          update: {
            status,
          },
        },
      },
    })
  }
)
