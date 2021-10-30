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
          isSaved: true,
        },
      },
      assignedToFeedbackNotifications: {
        select: {
          isRead: true,
          isSaved: true,
        },
      },
      feedbackStatusChangedNotifications: {
        select: {
          isRead: true,
          isSaved: true,
        },
      },
      feedbackAddedToRoadmapNotifications: {
        select: {
          isRead: true,
          isSaved: true,
        },
      },
      newFeedbackMessageNotifications: {
        select: {
          isRead: true,
          isSaved: true,
        },
      },
      newChangelogNotifications: {
        select: {
          isRead: true,
          isSaved: true,
        },
      },
    },
  })

  if (!notifications) return null

  type FilteredNotifications = {
    [key in keyof typeof notifications]: Array<{
      isRead: boolean
      isSaved: boolean
    }>
  }

  const filteredNotifications: Partial<FilteredNotifications> = {}

  Object.entries(notifications).forEach(([key, props]) => {
    filteredNotifications[key] = props.filter(({ isRead }) => !isRead)
  })

  return filteredNotifications as Required<FilteredNotifications>
})
