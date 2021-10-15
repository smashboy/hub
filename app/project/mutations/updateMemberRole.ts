import db from "db"
import { resolver } from "blitz"
import { UpdateProjectMember } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(UpdateProjectMember),
  authorizePipe("update", "project.members", ({ projectSlug }) => projectSlug),
  async ({ memberId, role }) => {
    await db.projectMember.update({
      where: {
        id: memberId,
      },
      data: {
        role,
      },
    })
  }
)
