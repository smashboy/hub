import { resolver } from "blitz"
import db, { ProjectMemberRole } from "db"
import slugify from "slugify"
import { CreateProject } from "../validations"

export default resolver.pipe(
  resolver.zod(CreateProject),
  async ({ name, description, websiteUrl, color, isPrivate }, ctx) => {
    const authUserId = ctx.session.userId!

    name = name.trim()
    description = description?.trim() ?? null

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    })

    await db.project.create({
      data: {
        name,
        description,
        websiteUrl,
        isPrivate,
        color,
        slug,
        settings: {
          create: {},
        },
        members: {
          create: {
            user: {
              connect: {
                id: authUserId,
              },
            },
            role: ProjectMemberRole.FOUNDER,
          },
        },
      },
    })
  }
)
