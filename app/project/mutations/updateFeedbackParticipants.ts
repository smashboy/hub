import db, { FeedbackNotificationType } from "db"
import { resolver, NotFoundError } from "blitz"
import { UpdateFeedbackParticipants } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(UpdateFeedbackParticipants),
  authorizePipe("update", "feedback.settings", ({ projectSlug }) => projectSlug),
  async ({ feedbackId, participants, projectSlug }, ctx) => {
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
      },
    })

    if (!feedback) throw new NotFoundError("Feedback not found.")

    const {
      participants: selectedMembers,
      content: { id: feedbackContentId, title },
    } = feedback

    await db.projectFeedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        participants: {
          set: participants.map((id) => ({ id })),
        },
      },
    })

    const notifyTransactions = selectedMembers
      .filter(({ user: { id } }) => id !== authUserId && !participants.includes(id))
      .map(({ user: { id } }) =>
        db.notification.create({
          data: {
            user: {
              connect: {
                id,
              },
            },
            feedbackNotification: {
              create: {
                projectSlug,
                feedbackId: feedbackContentId,
                feedbackTitle: title,
                type: FeedbackNotificationType.ASSIGNED,
              },
            },
          },
        })
      )

    await db.$transaction(notifyTransactions)
  }
)
