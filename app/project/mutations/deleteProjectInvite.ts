import db from "db"
import { resolver } from "blitz"
import { DeleteProjectInvite } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(DeleteProjectInvite),
  authorizePipe("delete", "project.settings.invites", ({ projectSlug }) => projectSlug),
  async ({ inviteId }) => {
    await db.projectInvite.delete({
      where: {
        id: inviteId,
      },
    })
  }
)
