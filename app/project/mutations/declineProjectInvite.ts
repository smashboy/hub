import db, { ProjectMemberRole } from "db"
import { resolver } from "blitz"
import { ManageProjectInvite } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(ManageProjectInvite),
  Guard.authorizePipe("decline", "project.invites"),
  async ({ inviteId }) => {
    await db.projectInvite.delete({
      where: {
        id: inviteId,
      },
    })
  }
)
