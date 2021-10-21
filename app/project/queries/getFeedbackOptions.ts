import db from "db"
import { resolver, NotFoundError } from "blitz"
import { GetCreateFeedbackInfo } from "../validations"
import { authorizePipe } from "app/guard/helpers"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(GetCreateFeedbackInfo),
  Guard.authorizePipe("read", "feedback.settings"),
  async ({ slug }) => {
    const project = await db.project.findFirst({
      where: {
        slug,
      },
      select: {
        roadmaps: {
          select: {
            id: true,
            name: true,
          },
        },
        members: {
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

    if (!project) throw new NotFoundError("Project not found")

    return project
  }
)
