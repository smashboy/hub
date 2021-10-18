import db, { ProjectMemberRole } from "db"
import { resolver } from "blitz"
import { ManageProjectInvite } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(ManageProjectInvite),
  Guard.authorizePipe("accept", "project.invites"),
  async ({ inviteId }) => {
    const invite = await db.projectInvite.findFirst({
      where: {
        id: inviteId,
      },
      select: {
        projectId: true,
        userId: true,
      },
    })

    // TODO: message
    if (!invite) return

    const { projectId, userId } = invite

    await db.projectMember.create({
      data: {
        role: ProjectMemberRole.MEMBER,
        project: {
          connect: {
            id: projectId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })

    await db.projectInvite.delete({
      where: {
        id: inviteId,
      },
    })
  }
)
