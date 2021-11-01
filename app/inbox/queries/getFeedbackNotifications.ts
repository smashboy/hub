import db, { Prisma } from "db"
import { resolver, paginate } from "blitz"
import Guard from "app/guard/ability"
import { GetNotificationsInput } from "./getInvitesNotifications"

const orderBy: Prisma.FeedbackNotificationOrderByWithRelationInput = {
  createdAt: "desc",
}

export default resolver.pipe(
  Guard.authorizePipe("read", "user.notifications"),
  async ({ notificationStatus, savedOnly, take = 10, skip = 0 }: GetNotificationsInput, ctx) => {
    const authUserId = ctx.session.userId!

    const where: Prisma.FeedbackNotificationWhereInput =
      notificationStatus === "all"
        ? {
            notifications: {
              userId: authUserId,
            },
            isSaved: savedOnly,
          }
        : {
            notifications: {
              userId: authUserId,
            },
            isRead: notificationStatus === "read" ? true : false,
            isSaved: savedOnly,
          }

    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () =>
        db.feedbackNotification.count({
          where,
          orderBy,
        }),
      query: (paginateArgs) =>
        db.feedbackNotification.findMany({
          ...paginateArgs,
          where,
          orderBy,
        }),
    })

    return {
      items,
      hasMore,
      nextPage,
      count,
    }
  }
)
