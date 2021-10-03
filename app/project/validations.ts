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
