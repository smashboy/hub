import db from "db"
import { resolver } from "blitz"
import { FilterRoadmapFeedback } from "../validations"
import Guard from "app/guard/ability"

export default resolver.pipe(
  resolver.zod(FilterRoadmapFeedback),
  Guard.authorizePipe("read", "feedback"),
  async ({ roadmapId, category }) => {
    const feedback = await db.projectFeedback.findMany({
      where: {
        roadmaps: {
          some: {
            id: roadmapId,
          },
        },
        content: {
          category: category || undefined,
        },
      },
      orderBy: {
        upvotedBy: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        createdAt: true,
        labels: {
          select: {
            name: true,
            color: true,
          },
        },
        content: {
          select: {
            id: true,
            title: true,
            category: true,
            status: true,
          },
        },
        author: {
          select: {
            username: true,
          },
        },
        upvotedBy: {
          select: {
            id: true,
          },
        },
      },
    })

    return feedback.map(({ upvotedBy, ...otherProps }) => ({
      ...otherProps,
      upvotedBy: upvotedBy.map(({ id }) => id),
    }))
  }
)
