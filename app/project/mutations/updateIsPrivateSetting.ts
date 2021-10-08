import db from "db"
import { resolver } from "blitz"
import { UpdateIsProjectPrivateDanger } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(UpdateIsProjectPrivateDanger),
  authorizePipe("update", "project.settings.danger", ({ slug }) => slug),
  async ({ isPrivate, slug }) => {
    await db.project.update({
      where: {
        slug,
      },
      data: {
        isPrivate,
      },
    })
  }
)
