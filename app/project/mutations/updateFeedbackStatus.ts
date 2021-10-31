import db, { FeedbackNotificationType } from "db"
import { resolver, NotFoundError } from "blitz"
import { UpdateFeedbackStatus } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(UpdateFeedbackStatus),
  authorizePipe("update", "feedback.settings", ({ projectSlug }) => projectSlug),
  async ({ feedbackId, status, projectSlug }, ctx) => {
    const authUserId = ctx.session.userId!

    const feedback = await db.projectFeedback.findFirst({
      where: {
        id: feedbackId,
      },
      select: {
        content: {
          select: {
            title: true,
            id: true,
          },
        },

        participants: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        upvotedBy: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!feedback) throw new NotFoundError("Feedback not found.")

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

    const {
      participants,
      upvotedBy,
      content: { id: feedbackContentId, title },
    } = feedback

    const userIds = [
      ...Array.from(
        new Set([...participants.map(({ user: { id } }) => id), ...upvotedBy.map(({ id }) => id)])
      ),
    ].filter((id) => id !== authUserId)

    const notifyTransactions = userIds.map((userId) =>
      db.feedbackNotification.create({
        data: {
          projectSlug,
          feedbackId: feedbackContentId,
          feedbackTitle: title,
          newStatus: status,
          type: FeedbackNotificationType.STATUS_CHANGED,
          notifications: {
            connectOrCreate: {
              where: {
                userId,
              },
              create: {
                user: {
                  connect: {
                    id: userId,
                  },
                },
              },
            },
          },
        },
      })
    )

    await db.$transaction(notifyTransactions)
  }
)
