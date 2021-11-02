import db from "db"
import { resolver } from "blitz"
import { UpdateFeedbackRoadmaps } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(UpdateFeedbackRoadmaps),
  authorizePipe("update", "feedback.settings", ({ projectSlug }) => projectSlug),
  async ({ feedbackId, roadmaps }) => {
    await db.projectFeedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        roadmaps: {
          set: roadmaps.map((id) => ({ id })),
        },
      },
    })
  }
)
