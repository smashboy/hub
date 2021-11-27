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
      id: true,
    },
  })

  const { id: projectId } = project

  const roadmaps = await db.projectRoadmap.findMany({
    where: {
      projectId,
    },
    select: {
      id: true,
      name: true,
    },
  })

  return roadmaps
})
