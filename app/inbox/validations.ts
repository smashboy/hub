import * as z from "zod"

export const UpdateNotificationSavedFlag = z.object({
  notificationId: z.number(),
  isSaved: z.boolean(),
})

export const MarkNotificationAsRead = z.object({
  notificationId: z.number(),
})
