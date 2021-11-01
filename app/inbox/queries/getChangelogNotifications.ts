import db, { Prisma } from "db"
import { resolver, paginate } from "blitz"
import Guard from "app/guard/ability"
import { GetNotificationsInput } from "./getInvitesNotifications"

const orderBy: Prisma.NewChangelogNotificationOrderByWithRelationInput = {
  createdAt: "desc",
}

export default resolver.pipe(
  Guard.authorizePipe("read", "user.notifications"),
  async ({ notificationStatus, take = 10, skip = 0 }: GetNotificationsInput, ctx) => {
    const authUserId = ctx.session.userId!

    const where: Prisma.NewChangelogNotificationWhereInput =
      notificationStatus === "all"
        ? {
            notifications: {
              userId: authUserId,
            },
          }
        : {
            notifications: {
              userId: authUserId,
            },
            isRead: notificationStatus === "read" ? true : false,
          }

    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () =>
        db.newChangelogNotification.count({
          where,
          orderBy,
        }),
      query: (paginateArgs) =>
        db.newChangelogNotification.findMany({
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