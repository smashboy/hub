import db from "db"
import { resolver } from "blitz"
import Guard from "app/guard/ability"
import { MarkNotificationAsRead } from "../validations"

export default resolver.pipe(
  resolver.zod(MarkNotificationAsRead),
  Guard.authorizePipe("update", "user.notifications"),
  async ({ notificationId }) => {
    await db.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    })
  }
)
