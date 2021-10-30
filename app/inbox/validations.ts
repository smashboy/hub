import * as z from "zod"

export const notificationsPrismaModelKey = z.enum([
  "projectInvite",
  "assignedToFeedbackNotification",
  "feedbackStatusChangedNotification",
  "feedbackAddedToRoadmapNotification",
  "newFeedbackMessageNotification",
  "newChangelogNotification",
])

export const UpdateNotificationSavedFlag = z.object({
  notificationId: z.number(),
  notificationsPrismaModelKey: notificationsPrismaModelKey,
  isSaved: z.boolean(),
})

export const MarkNotificationAsRead = z.object({
  notificationId: z.number(),
  notificationsPrismaModelKey: notificationsPrismaModelKey,
})
