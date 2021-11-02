import db from "db"
import { resolver, NotFoundError } from "blitz"
import slugify from "slugify"
import { CreateChangelog } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(CreateChangelog),
  authorizePipe("create", "project.roadmap", ({ projectSlug }) => projectSlug),
  async ({ title, content, projectSlug, previewImageUrl, roadmapId }, ctx) => {
    const authUserId = ctx.session.userId!

    title = title.trim()

    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    })

    const project = await db.project.findFirst({
      where: {
        slug: projectSlug,
      },
      select: {
        name: true,
        followers: {
          select: {
            id: true,
          },
        },
        members: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })

    if (!project) throw new NotFoundError("Project not found.")

    await db.projectChangelog.create({
      data: {
        title,
        content,
        previewImageUrl,
        slug,
        project: {
          connect: {
            slug: projectSlug,
          },
        },
      },
    })

    await db.projectRoadmap.update({
      where: {
        id: roadmapId,
      },
      data: {
        isArchived: true,
      },
    })

    const { followers, members, name } = project

    const userIds = [
      ...Array.from(
        new Set([...members.map(({ user: { id } }) => id), ...followers.map(({ id }) => id)])
      ),
    ].filter((id) => id !== authUserId)

    const notifyTransactions = userIds.map((userId) =>
      db.notification.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          newChangelogNotification: {
            create: {
              projectSlug,
              projectName: name,
              changelogSlug: slug,
              title,
              previewImageUrl,
            },
          },
        },
      })
    )

    await db.$transaction(notifyTransactions)
  }
)
