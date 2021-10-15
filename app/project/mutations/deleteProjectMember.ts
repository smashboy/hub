import db from "db"
import { resolver } from "blitz"
import { DeleteProjectMember } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(DeleteProjectMember),
  authorizePipe("delete", "project.members", ({ projectSlug }) => projectSlug),
  async ({ memberId }) => {
    await db.projectMember.delete({
      where: {
        id: memberId,
      },
    })
  }
)
