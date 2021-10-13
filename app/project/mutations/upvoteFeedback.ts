import db from "db"
import { resolver } from "blitz"
import Guard from "app/guard/ability"
import { UpvoteFeedback } from "../validations"

export default resolver.pipe(
  resolver.zod(UpvoteFeedback),
  Guard.authorizePipe("upvote", "feedback"),
  async ({ feedbackId }, ctx) => {
    const authUserId = ctx.session.userId!

    const feedback = await db.projectFeedback.findFirst({
      where: {
        id: feedbackId,
      },
      select: {
        upvotedBy: {
          where: {
            id: authUserId,
          },
          select: {
            id: true,
          },
        },
      },
    })

    const upvotedBy = feedback?.upvotedBy.map(({ id }) => id) || []

    if (upvotedBy.includes(authUserId)) {
      await db.projectFeedback.update({
        where: {
          id: feedbackId,
        },
        data: {
          upvotedBy: {
            disconnect: {
              id: authUserId,
            },
          },
        },
      })
      return
    }

    await db.projectFeedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        upvotedBy: {
          connect: {
            id: authUserId,
          },
        },
      },
    })
  }
)
