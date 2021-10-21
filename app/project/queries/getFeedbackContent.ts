import db from "db"
import { resolver, NotFoundError } from "blitz"
import { GetFeedbackContent } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(GetFeedbackContent),
  Guard.authorizePipe("read", "feedback"),
  async ({ projectSlug, feedbackId }) => {
    const feedback = await db.projectFeedbackContent.findFirst({
      where: {
        id: feedbackId,
        projectSlug: projectSlug,
      },
      select: {
        content: true,
      },
    })

    if (!feedback) throw new NotFoundError("Feedback not found")

    const { content } = feedback
    return content
  }
)
