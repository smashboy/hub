import db from "db"
import { resolver } from "blitz"
import { DeleteLabel } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(DeleteLabel),
  authorizePipe("delete", "project.labels", ({ projectSlug }) => projectSlug),
  async ({ labelId }) => {
    await db.projectFeedbackLabel.delete({
      where: {
        id: labelId,
      },
    })
  }
)
