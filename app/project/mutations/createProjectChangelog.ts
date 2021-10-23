import db from "db"
import { resolver } from "blitz"
import slugify from "slugify"
import { CreateChangelog } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(CreateChangelog),
  authorizePipe("create", "project.roadmap", ({ projectSlug }) => projectSlug),
  async ({ title, content, projectSlug }) => {
    title = title.trim()

    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    })

    await db.projectChangelog.create({
      data: {
        title,
        content,
        slug,
        project: {
          connect: {
            slug: projectSlug,
          },
        },
      },
    })
  }
)
