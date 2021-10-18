import db from "db"
import { resolver } from "blitz"
import slugify from "slugify"
import { CreateRoadmap } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(CreateRoadmap),
  Guard.authorizePipe("create", "project.roadmap"),
  async ({ name, description, projectSlug, dueTo }) => {
    name = name.trim()
    description = description?.trim() ?? null

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    })

    await db.projectRoadmap.create({
      data: {
        name,
        description,
        slug,
        dueTo,
        project: {
          connect: {
            slug: projectSlug,
          },
        },
      },
    })
  }
)
