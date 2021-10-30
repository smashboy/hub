import db, { FeedbackNotificationType } from "db"
import { resolver, NotFoundError } from "blitz"
import { UpdateFeedback } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(UpdateFeedback),
  Guard.authorizePipe("update", "feedback"),
  async ({ title, category, content, participants, roadmaps, labels, feedbackId }, ctx) => {
    const authUserId = ctx.session.userId!

    title = title.trim()

    const feedback = await db.projectFeedback.findFirst({
      where: {
        id: feedbackId,
      },
      select: {
        content: {
          select: {
            id: true,
          },
        },
        project: {
          select: {
            name: true,
            slug: true,
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

    await db.projectFeedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        content: {
          update: {
            title,
            category,
            content,
          },
        },
        labels: {
          set: labels.map((id) => ({ id })),
        },
        participants: {
          set: participants.map((id) => ({ id })),
        },
        roadmaps: {
          set: roadmaps.map((id) => ({ id })),
        },
      },
    })

    const {
      participants: selectedMembers,
      project: { slug: projectSlug, name: projectName },
      content: { id: feedbackContentId },
    } = feedback

    const notifyTransactions = selectedMembers
      .filter(({ user: { id } }) => id !== authUserId && !participants.includes(id))
      .map(({ user: { id } }) =>
        db.feedbackNotification.create({
          data: {
            projectSlug,
            feedbackId: feedbackContentId,
            projectName,
            feedbackTitle: title,
            type: FeedbackNotificationType.ASSIGNED,
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
