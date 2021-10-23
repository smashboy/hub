import db from "db"
import { resolver } from "blitz"
import slugify from "slugify"
import { UpdateChangelog } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(UpdateChangelog),
  authorizePipe("update", "project.roadmap", ({ projectSlug }) => projectSlug),
  async ({ title, content, projectSlug, changelogId }) => {
    title = title.trim()

    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    })

    await db.projectChangelog.update({
      where: {
        id: changelogId,
      },
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

    return slug
  }
)
