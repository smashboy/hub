import db from "db"
import { resolver } from "blitz"
import { CreateFeedbackMessage } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(CreateFeedbackMessage),
  Guard.authorizePipe("create", "feedback.messages"),
  async ({ feedbackId, content, category }, ctx) => {
    const authUserId = ctx.session.userId!

    await db.projectFeedbackMessage.create({
      data: {
        content,
        category,
        author: {
          connect: {
            id: authUserId,
          },
        },
        feedback: {
          connect: {
            id: feedbackId,
          },
        },
      },
    })
  }
)
