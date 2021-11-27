import db from "db"
import { resolver } from "blitz"
import { ProjectSlugValidation } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(ProjectSlugValidation),
  Guard.authorizePipe("read", "feedback.settings"),
  async ({ projectSlug }) => {
    const project = await db.project.findFirst({
      rejectOnNotFound: true,
      where: {
        slug: projectSlug,
      },
      select: {
        roadmaps: {
          orderBy: {
            createdAt: "desc",
          },
          where: {
            isArchived: false,
          },
          select: {
            id: true,
            name: true,
          },
        },
        members: {
          orderBy: {
            createdAt: "desc",
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
        },
        settings: {
          select: {
            labels: {
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                name: true,
                color: true,
                description: true,
              },
            },
          },
        },
      },
    })

    return project
  }
)
