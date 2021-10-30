import db, { Prisma } from "db"
import { resolver, paginate } from "blitz"
import Guard from "app/guard/ability"

export type NotificationReadStatus = "all" | "read" | "unread"

export interface GetNotificationsInput {
  notificationStatus: NotificationReadStatus
  take?: number
  skip?: number
  savedOnly?: boolean
}

const orderBy: Prisma.ProjectInviteOrderByWithRelationInput = {
  createdAt: "desc",
}

export default resolver.pipe(
  Guard.authorizePipe("read", "user.notifications"),
  async ({ notificationStatus, take = 10, skip = 0 }: GetNotificationsInput, ctx) => {
    const authUserId = ctx.session.userId!

    const where: Prisma.ProjectInviteWhereInput =
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
        db.projectInvite.count({
          where,
          orderBy,
        }),
      query: (paginateArgs) =>
        db.projectInvite.findMany({
          ...paginateArgs,
          where,
          orderBy,
          select: {
            id: true,
            createdAt: true,
            isRead: true,
            isSaved: true,
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
