import db from "db"
import { resolver } from "blitz"
import slugify from "slugify"
import { UpdateProjectRoadmap } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(UpdateProjectRoadmap),
  Guard.authorizePipe("update", "project.roadmap"),
  async ({ name, description, roadmapId, dueTo }) => {
    name = name.trim()
    description = description?.trim() ?? null

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    })

    await db.projectRoadmap.update({
      where: {
        id: roadmapId,
      },
      data: {
        name,
        description,
        slug,
        dueTo,
      },
    })

    return slug
  }
)
