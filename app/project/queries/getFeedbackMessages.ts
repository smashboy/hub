import Guard from "app/guard/ability"
import { resolver } from "blitz"
import db from "db"
import { GetFeedbackMessages } from "../validations"

// export interface GetFeedbackMessagesInput
//   extends Pick<Prisma.ProjectFindManyArgs, "skip" | "take"> {
//   feedbackId: number
//   isPublic: boolean
// }

export default resolver.pipe(
  resolver.zod(GetFeedbackMessages),
  Guard.authorizePipe("read", "feedback.messages"),
  async ({ feedbackId, isPublic }) => {
    const messages = await db.projectFeedbackMessage.findMany({
      where: {
        isPublic,
        feedbackId,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        createdAt: true,
        content: true,
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    })

    return messages
  }
)
