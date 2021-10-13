import db from "db"
import { resolver } from "blitz"
import { DeleteFeedbcakMessage } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(DeleteFeedbcakMessage),
  Guard.authorizePipe("delete", "feedback.messages"),
  async ({ messageId }) => {
    await db.projectFeedbackMessage.delete({
      where: {
        id: messageId,
      },
    })
  }
)
