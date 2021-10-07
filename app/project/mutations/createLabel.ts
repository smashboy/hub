import db from "db"
import { resolver } from "blitz"
import { CreateLabel } from "../validations"

export default resolver.pipe(
  resolver.zod(CreateLabel),
  async ({ name, color, description, projectSlug }) => {
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
              create: {
                name,
                description,
                color,
              },
            },
          },
        },
      },
    })
  }
)
