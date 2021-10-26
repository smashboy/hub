import db from "db"
import { resolver, NotFoundError } from "blitz"
import { GetFeedbackSearchOptions } from "../validations"

export default resolver.pipe(resolver.zod(GetFeedbackSearchOptions), async ({ projectSlug }) => {
  const project = await db.project.findFirst({
    where: {
      slug: projectSlug,
    },
    select: {
      id: true,
    },
  })

  if (!project) throw new NotFoundError("Project not found")

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
