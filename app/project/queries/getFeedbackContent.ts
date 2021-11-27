import db from "db"
import { resolver } from "blitz"
import { GetFeedbackContent } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(GetFeedbackContent),
  Guard.authorizePipe("read", "feedback"),
  async ({ projectSlug, feedbackId }) => {
    const feedback = await db.projectFeedbackContent.findFirst({
      rejectOnNotFound: true,
      where: {
        id: feedbackId,
        projectSlug: projectSlug,
      },
      select: {
        content: true,
      },
    })

    const { content } = feedback
    return content
  }
)
