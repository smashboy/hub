import db from "db"
import { resolver } from "blitz"
import { UpdateLabel } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(UpdateLabel),
  authorizePipe("update", "project.labels", ({ projectSlug }) => projectSlug),
  async ({ name, color, description, projectSlug, labelId }) => {
    name = name.trim()
    description = description?.trim() || undefined

    await db.project.update({
      where: {
        slug: projectSlug,
      },
      data: {
        settings: {
          update: {
            labels: {
              update: {
                where: {
                  id: labelId,
                },
                data: {
                  name,
                  description,
                  color,
                },
              },
            },
          },
        },
      },
    })
  }
)
