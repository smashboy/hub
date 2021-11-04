export type AllowedFileType = "image/jpeg" | "image/png" | "image/webp"
export type ContentBacketName = "feedback" | "changelogs" | "feedback-messages"

export const allowedImageTypes: Array<AllowedFileType | string> = [
  "image/jpeg",
  "image/png",
  "image/webp",
]

export const bucketIds: ContentBacketName[] = ["changelogs", "feedback", "feedback-messages"]
