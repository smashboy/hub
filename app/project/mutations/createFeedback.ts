import db, { FeedbackNotificationType } from "db"
import { resolver } from "blitz"
import { CreateFeedback } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(CreateFeedback),
  Guard.authorizePipe("create", "feedback"),
  async ({ projectSlug, title, category, content, participants, roadmaps, labels }, ctx) => {
    const authUserId = ctx.session.userId!

    title = title.trim()

    const feedbackCount = await db.projectFeedback.findFirst({
      where: {
        projectSlug,
      },
      orderBy: {
        content: {
          id: "desc",
        },
      },
      select: {
        content: {
          select: {
            id: true,
          },
        },
      },
    })

    const newId = (feedbackCount?.content.id || 0) + 1

    const {
      content: { id: feedbackId, title: feedbackTitle },
    } = await db.projectFeedback.create({
      data: {
        content: {
          create: {
            id: newId,
            title,
            category,
            content,
            projectSlug,
          },
        },
        author: {
          connect: {
            id: authUserId,
          },
        },
        project: {
          connect: {
            slug: projectSlug,
          },
        },
        labels: {
          connect: labels.map((id) => ({ id })),
        },
        participants: {
          connect: participants.map((id) => ({ id })),
        },
        roadmaps: {
          connect: roadmaps.map((id) => ({ id })),
        },
      },
      select: {
        content: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    const selectedMembers = await db.projectMember.findMany({
      where: {
        id: {
          in: participants,
        },
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    })

    const notifyTransactions = selectedMembers
      .filter(({ user: { id } }) => id !== authUserId)
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
                feedbackId,
                feedbackTitle,
                type: FeedbackNotificationType.ASSIGNED,
              },
            },
          },
        })
      )

    await db.$transaction(notifyTransactions)

    return feedbackId
  }
)
