import * as z from "zod"
import { isUrl } from "app/core/utils/common"

export const link = z.string().refine((link) => isUrl(link), {
  message: "Invalid link",
})

export const LinkForm = z.object({
  link,
})

const bucketIds = z.enum(["changelogs", "feedback", "feedback-messages"])

export const UploadImage = z.object({
  file: z.string(),
  type: z.string(),
  bucketId: bucketIds,
})
