import * as z from "zod"
import { isUrl } from "../utils/common"

export const link = z.string().refine((link) => isUrl(link), {
  message: "Invalid link",
})

export const LinkForm = z.object({
  link,
})
