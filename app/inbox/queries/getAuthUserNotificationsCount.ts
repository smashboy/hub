import db from "db"
import { resolver } from "blitz"
// import Guard from "app/guard/ability"

type FilteredNotificationKey =
  | "feedbackNotifications"
  | "newChangelogNotifications"
  | "projectInvites"

export default resolver.pipe(async (_, ctx) => {
  const authUserId = ctx.session.userId

  if (!authUserId) return null

  const notifications = await db.notification.findMany({
    where: {
      userId: authUserId,
      isRead: false,
    },
    select: {
      isRead: true,
      isSaved: true,
      feedbackNotification: {
        select: {
          id: true,
        },
      },
      newChangelogNotification: {
        select: {
          id: true,
        },
      },
      projectInvite: {
        select: {
          id: true,
        },
      },
    },
  })

  type FilteredNotifications = {
    [key in FilteredNotificationKey]: Array<{
      isRead: boolean
      isSaved: boolean
    }>
  }

  const filteredNotifications: FilteredNotifications = {
    feedbackNotifications: [],
    projectInvites: [],
    newChangelogNotifications: [],
  }

  for (const notification of notifications) {
    const { feedbackNotification, newChangelogNotification, projectInvite, ...otherProps } =
      notification
    if (feedbackNotification) {
      filteredNotifications.feedbackNotifications.push(otherProps)
    } else if (newChangelogNotification) {
      filteredNotifications.newChangelogNotifications.push(otherProps)
    } else if (projectInvite) {
      filteredNotifications.projectInvites.push(otherProps)
    }
  }

  return filteredNotifications
})
