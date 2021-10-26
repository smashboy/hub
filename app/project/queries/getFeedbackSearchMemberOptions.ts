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

  const members = await db.projectMember.findMany({
    where: {
      projectId,
    },
    select: {
      id: true,
      user: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
    },
  })

  return members
})
