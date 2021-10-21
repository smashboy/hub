import db from "db"
import { resolver, NotFoundError } from "blitz"
import Guard from "app/guard/ability"
import { FollowProject } from "../validations"

export default resolver.pipe(
  resolver.zod(FollowProject),
  Guard.authorizePipe("follow", "project"),
  async ({ slug }, ctx) => {
    const authUserId = ctx.session.userId!

    const project = await db.project.findFirst({
      where: {
        slug,
      },
      select: {
        followers: {
          where: {
            id: authUserId,
          },
        },
      },
    })

    if (!project) throw new NotFoundError("Project not found.")

    const isFollowing = project.followers.length === 1

    if (isFollowing) {
      await db.project.update({
        where: {
          slug,
        },
        data: {
          followers: {
            disconnect: {
              id: authUserId,
            },
          },
        },
      })
      return false
    }

    await db.project.update({
      where: {
        slug,
      },
      data: {
        followers: {
          connect: {
            id: authUserId,
          },
        },
      },
    })

    return true
  }
)
