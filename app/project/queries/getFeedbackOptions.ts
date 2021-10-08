import db, { ProjectMemberRole } from "db"
import { resolver, NotFoundError } from "blitz"
import { GetCreateFeedbackInfo } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(GetCreateFeedbackInfo),
  authorizePipe("manage", "feedback.settings", ({ slug }) => slug),
  async ({ slug }) => {
    const project = await db.project.findFirst({
      where: {
        slug,
      },
      select: {
        roadmaps: {
          select: {
            id: true,
            title: true,
          },
        },
        members: {
          where: {
            role: {
              not: ProjectMemberRole.FOLLOWER,
            },
          },
          select: {
            user: {
              select: {
                id: true,
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