import db from "db"
import { resolver } from "blitz"
import { ProjectSlugValidation } from "../validations"

export default resolver.pipe(resolver.zod(ProjectSlugValidation), async ({ projectSlug }) => {
  const project = await db.project.findFirst({
    rejectOnNotFound: true,
    where: {
      slug: projectSlug,
    },
    select: {
      settings: {
        select: {
          id: true,
        },
      },
    },
  })

  const settingsId = project.settings!.id

  const labels = await db.projectFeedbackLabel.findMany({
    where: {
      settingsId,
    },
    select: {
      id: true,
      name: true,
      color: true,
      description: true,
    },
  })

  return labels
})
