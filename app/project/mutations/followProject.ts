import db from "db"
import { resolver } from "blitz"
import Guard from "app/guard/ability"
import { FollowProject } from "../validations"

export default resolver.pipe(
  resolver.zod(FollowProject),
  Guard.authorizePipe("follow", "project"),
  async ({ slug }, ctx) => {
    const authUserId = ctx.session.userId!

    const member = await db.projectMember.findFirst({
      where: {
        project: {
          slug,
        },
        userId: authUserId,
      },
      select: {
        id: true,
      },
    })

    if (member) {
      await db.projectMember.delete({
        where: {
          id: member.id,
        },
      })
      return false
    }

    await db.projectMember.create({
      data: {
        user: {
          connect: {
            id: authUserId,
          },
        },
        project: {
          connect: {
            slug,
          },
        },
      },
    })

    return true
  }
)
