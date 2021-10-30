import db from "db"
import { resolver } from "blitz"
import Guard from "app/guard/ability"
import { UpdateNotificationSavedFlag } from "../validations"

export default resolver.pipe(
  resolver.zod(UpdateNotificationSavedFlag),
  Guard.authorizePipe("update", "user.notifications"),
  async ({ notificationId, notificationsPrismaModelKey, isSaved }) => {
    await db[notificationsPrismaModelKey].update({
      where: {
        id: notificationId,
      },
      data: {
        isSaved,
      },
    })
  }
)
