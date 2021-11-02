import db from "db"
import { resolver, NotFoundError } from "blitz"
import { ManageProjectInvite } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(ManageProjectInvite),
  Guard.authorizePipe("decline", "project.invites"),
  async ({ inviteId }) => {
    const invite = await db.projectInvite.findFirst({
      where: {
        id: inviteId,
      },
      select: {
        notificationId: true,
      },
    })

    if (!invite) throw new NotFoundError("Invite not found.")

    const { notificationId } = invite

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
