import db from "db"
import { resolver } from "blitz"
import { DeleteProject } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(DeleteProject),
  authorizePipe("delete", "project", ({ projectSlug }) => projectSlug),
  async ({ projectSlug }) => {
    await db.project.delete({
      where: {
        slug: projectSlug,
      },
    })
  }
)
