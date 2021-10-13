import { FeedbackCategory } from "db"
import * as z from "zod"

export const projectName = z
  .string()
  .regex(new RegExp("^[A-Za-z0-9_-\\s]{3,50}$"), { message: "Invalid project name" })

export const CreateProject = z.object({
  name: projectName,
  description: z.string().nullable(),
  websiteUrl: z.string().nullable(),
  color: z.string(),
  isPrivate: z.boolean(),
})

export const GetCreateFeedbackInfo = z.object({
  slug: z.string(),
})

export const CreateLabel = z.object({
  name: z.string().min(1).max(25),
  color: z.string(),
  projectSlug: z.string(),
  description: z.string().max(100).optional(),
})

export const FollowProject = z.object({
  slug: z.string(),
})

export const UpdateProject = CreateProject.omit({ isPrivate: true }).merge(
  z.object({
    slug: z.string(),
  })
)

export const UpdateIsProjectPrivateDanger = z.object({
  slug: z.string(),
  isPrivate: z.boolean(),
})

export const CreateFeedback = z.object({
  projectSlug: z.string(),
  title: z.string().min(1).max(75),
  category: z.enum([FeedbackCategory.BUG, FeedbackCategory.FEATURE, FeedbackCategory.IMPROVEMENT]),
  content: z.string(),
  participants: z.array(z.number()),
  roadmaps: z.array(z.number()),
  labels: z.array(z.string()),
})

export const UpdateFeedback = CreateFeedback.omit({ projectSlug: true }).merge(
  z.object({
    feedbackId: z.number(),
  })
)

export const CreateFeedbackMessage = z.object({
  feedbackId: z.number(),
  content: z.string(),
  isPublic: z.boolean(),
})

export const UpdateFeedbackMessage = z.object({
  messageId: z.number(),
  content: z.string(),
})

export const DeleteFeedbcakMessage = UpdateFeedbackMessage.omit({ content: true })

export const GetFeedbackMessages = z.object({
  feedbackId: z.number(),
  isPublic: z.boolean(),
})

export const UpvoteFeedback = z.object({
  feedbackId: z.number(),
})
