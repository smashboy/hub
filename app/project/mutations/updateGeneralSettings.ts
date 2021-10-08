import db from "db"
import { resolver } from "blitz"
import slugify from "slugify"
import { UpdateProject } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(UpdateProject),
  authorizePipe("update", "project.settings.general", ({ slug }) => slug),
  async ({ name, description, color, websiteUrl, slug }) => {
    name = name.trim()
    description = description?.trim() ?? null

    const updatedSlug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    })

    await db.project.update({
      where: {
        slug,
      },
      data: {
        name,
        description,
        websiteUrl,
        color,
        slug: updatedSlug,
      },
    })
  }
)
