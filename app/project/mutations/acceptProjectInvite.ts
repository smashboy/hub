import db from "db"
import { resolver, NotFoundError } from "blitz"
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
        notificationId: true,
        notification: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })

    if (!invite) throw new NotFoundError("Invite not found.")

    const {
      projectId,
      notificationId,
      notification: {
        user: { id: userId },
      },
    } = invite

    await db.projectMember.create({
      data: {
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

    await db.$transaction([
      db.projectInvite.delete({
        where: {
          id: inviteId,
        },
      }),
      db.notification.delete({
        where: {
          id: notificationId,
        },
      }),
    ])
  }
)
