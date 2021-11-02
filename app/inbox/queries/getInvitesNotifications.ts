import db, { Prisma } from "db"
import { resolver, paginate } from "blitz"
import Guard from "app/guard/ability"

export type NotificationReadStatus = "all" | "read" | "unread"

export interface GetNotificationsInput {
  notificationStatus: NotificationReadStatus
  take?: number
  skip?: number
  savedOnly?: true
}

const orderBy: Prisma.NotificationOrderByWithRelationInput = {
  createdAt: "desc",
}

export default resolver.pipe(
  Guard.authorizePipe("read", "user.notifications"),
  async ({ notificationStatus, savedOnly, take = 10, skip = 0 }: GetNotificationsInput, ctx) => {
    const authUserId = ctx.session.userId!

    const where: Prisma.NotificationWhereInput = {
      userId: authUserId,
      isRead:
        notificationStatus === "all" ? undefined : notificationStatus === "read" ? true : false,
      projectInvite: {
        is: {},
      },
      isSaved: savedOnly,
    }

    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () =>
        db.notification.count({
          where,
          orderBy,
        }),
      query: (paginateArgs) =>
        db.notification.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            projectInvite: {
              select: {
                id: true,
                project: {
                  select: {
                    name: true,
                    slug: true,
                    isPrivate: true,
                    description: true,
                    logoUrl: true,
                  },
                },
              },
            },
          },
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
