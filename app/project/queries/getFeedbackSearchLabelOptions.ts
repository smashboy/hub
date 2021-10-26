import db from "db"
import { resolver, NotFoundError } from "blitz"
import { GetFeedbackSearchOptions } from "../validations"

export default resolver.pipe(resolver.zod(GetFeedbackSearchOptions), async ({ projectSlug }) => {
  const project = await db.project.findFirst({
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

  if (!project) throw new NotFoundError("Project not found")

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
