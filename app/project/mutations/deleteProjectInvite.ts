import db from "db"
import { resolver } from "blitz"
import { DeleteProjectInvite } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(DeleteProjectInvite),
  Guard.authorizePipe("delete", "project.invites"),
  async ({ inviteId }) => {
    await db.projectInvite.delete({
      where: {
        id: inviteId,
      },
    })
  }
)
