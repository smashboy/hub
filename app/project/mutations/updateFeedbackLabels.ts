import db from "db"
import { resolver } from "blitz"
import { UpdateFeedbackLabels } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(UpdateFeedbackLabels),
  authorizePipe("update", "feedback.settings", ({ projectSlug }) => projectSlug),
  async ({ feedbackId, labels }) => {
    await db.projectFeedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        labels: {
          set: labels.map((id) => ({ id })),
        },
      },
    })
  }
)
