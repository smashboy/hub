import { z } from "zod"

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
  description: z.string().max(100).optional(),
})

export const FollowProject = z.object({
  slug: z.string(),
})
