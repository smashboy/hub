import db from "db"
import { resolver } from "blitz"
import Guard from "app/guard/ability"

export default resolver.pipe(Guard.authorizePipe("read", "user.notifications"), async (_, ctx) => {
  const authUserId = ctx.session.userId!

  const notifications = await db.notifications.findFirst({
    where: {
      userId: authUserId,
    },
    select: {
      projectInvites: {
        select: {
          isRead: true,
        },
      },
      assignedToFeedbackNotifications: {
        select: {
          isRead: true,
        },
      },
      feedbackStatusChangedNotifications: {
        select: {
          isRead: true,
        },
      },
      feedbackAddedToRoadmapNotifications: {
        select: {
          isRead: true,
        },
      },
      newFeedbackMessageNotifications: {
        select: {
          isRead: true,
        },
      },
      newChangelogNotifications: {
        select: {
          isRead: true,
        },
      },
    },
  })

  if (!notifications) return null

  type FilteredNotifications = {
    [key in keyof typeof notifications]: Array<{
      isRead: boolean
    }>
  }

  const filteredNotifications: Partial<FilteredNotifications> = {}

  Object.entries(notifications).forEach(([key, props]) => {
    filteredNotifications[key] = props.filter(({ isRead }) => !isRead)
  })

  return filteredNotifications as Required<FilteredNotifications>
})
