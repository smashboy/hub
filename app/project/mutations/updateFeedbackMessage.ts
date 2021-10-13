import db from "db"
import { resolver } from "blitz"
import { UpdateFeedbackMessage } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(UpdateFeedbackMessage),
  Guard.authorizePipe("update", "feedback.messages"),
  async ({ messageId, content }) => {
    await db.projectFeedbackMessage.update({
      where: {
        id: messageId,
      },
      data: {
        content,
      },
    })
  }
)
