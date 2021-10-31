import db, { FeedbackMessageCategory, FeedbackNotificationType } from "db"
import { resolver } from "blitz"
import { CreateFeedbackMessage } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(CreateFeedbackMessage),
  Guard.authorizePipe("create", "feedback.messages"),
  async ({ feedbackId, content, category, projectSlug }, ctx) => {
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

    if (category !== FeedbackMessageCategory.INTERNAL) return

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
      },
    })

    const {
      participants: selectedMembers,
      content: { id: feedbackContentId, title },
    } = feedback!

    const notifyTransactions = selectedMembers
      .filter(({ user: { id } }) => id !== authUserId)
      .map(({ user: { id } }) =>
        db.feedbackNotification.create({
          data: {
            projectSlug,
            feedbackId: feedbackContentId,
            feedbackTitle: title,
            type: FeedbackNotificationType.NEW_INTERNAL_MESSAGE,
            notifications: {
              connectOrCreate: {
                where: {
                  userId: id,
                },
                create: {
                  user: {
                    connect: {
                      id,
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
