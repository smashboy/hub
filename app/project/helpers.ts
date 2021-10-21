import db, { FeedbackCategory, ProjectMemberRole, FeedbackStatus } from "db"
import { SessionContext } from "blitz"
import { countProgress } from "app/core/utils/blitz"

export interface ProjectPageProps {
  project: {
    name: string
    slug: string
    color: string
    isPrivate: boolean
    description: string | null
    websiteUrl: string | null
    logoUrl: string | null
    role: ProjectMemberRole | null
  }
}

export interface FeedbackPageProps extends ProjectPageProps {
  feedback: {
    id: number
    contentId: number
    createdAt: Date
    title: string
    category: FeedbackCategory
    status: FeedbackStatus
    content: string
    upvotedBy: number[]
    author: {
      id: number
      username: string
      avatarUrl: string | null
    }
    labels: Array<{
      id: string
      name: string
      color: string
    }>
    roadmaps: Array<{ id: number; name: string }>
    participants: Array<{
      id: number
      user: {
        username: string
        avatarUrl: string | null
      }
    }>
  }
}

export interface MembersSettingsPageProps extends ProjectPageProps {
  memberSettings: {
    members: Array<{
      user: {
        username: string
        email: string
        avatarUrl: string | null
      }
      id: number
      role: ProjectMemberRole
    }>
    invites: Array<{
      id: number
      user: {
        username: string
        email: string
        avatarUrl: string | null
      }
    }>
  }
}

export interface RoadmapsPageProps extends ProjectPageProps {
  roadmaps: {
    name: string
    description: string | null
    slug: string
    dueTo: Date | null
  }[]
}

export type RoadmapFeedback = {
  author: {
    username: string
  }
  id: number
  createdAt: Date
  labels: Array<{
    name: string
    color: string
  }>
  content: {
    id: number
    title: string
    category: FeedbackCategory
    status: FeedbackStatus
  }
  upvotedBy: number[]
}

export interface RoadmapPageProps extends ProjectPageProps {
  roadmap: {
    id: number
    name: string
    description: string | null
    dueTo: Date | null
    progress: number
    feedback: Array<RoadmapFeedback>
  }
}

// const session = await getSession(req, res)
// const userId = session?.userId || undefined
// const slug = (params?.slug as string) || null

export const getFeedback = async (
  slug: string,
  feedbackId: number | null
): Promise<Omit<FeedbackPageProps, "project"> | null> => {
  if (!feedbackId) return null

  const feedback = await db.projectFeedback.findFirst({
    where: {
      content: {
        projectSlug: slug,
        id: feedbackId,
      },
    },
    select: {
      id: true,
      content: {
        select: {
          id: true,
          createdAt: true,
          title: true,
          category: true,
          status: true,
          content: true,
        },
      },
      upvotedBy: {
        select: {
          id: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      labels: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      roadmaps: {
        select: {
          id: true,
          name: true,
        },
      },
      participants: {
        select: {
          id: true,
          user: {
            select: {
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  })

  if (!feedback) return null

  const {
    content: { id: contentId, ...content },
    upvotedBy,
    ...otherProps
  } = feedback

  return {
    feedback: { ...otherProps, ...content, contentId, upvotedBy: upvotedBy.map(({ id }) => id) },
  }
}

export const getProjectInfo = async (
  slug: string | null,
  session: SessionContext,
  allowedRoles?: Array<ProjectMemberRole | undefined>
): Promise<ProjectPageProps | null> => {
  const userId = session?.userId || undefined

  if (!slug) return null

  const project = await db.project.findFirst({
    where: {
      slug,
    },
    select: {
      name: true,
      color: true,
      isPrivate: true,
      description: true,
      websiteUrl: true,
      logoUrl: true,
      members: {
        where: {
          userId,
        },
        select: {
          role: true,
        },
      },
    },
  })

  if (!project) return null

  const { members, isPrivate, ...otherProjectProps } = project

  const member = members[0]

  if (isPrivate && (!member || member.role === ProjectMemberRole.FOLLOWER)) return null

  const props: ProjectPageProps = {
    project: { ...otherProjectProps, slug, role: member?.role || null, isPrivate },
  }

  if (!allowedRoles) return props

  if (!allowedRoles.includes(member?.role)) return null

  return props
}

export const getProjectMembersSettings = async (
  slug: string
): Promise<Omit<MembersSettingsPageProps, "project">> => {
  const project = await db.project.findFirst({
    where: {
      slug,
    },
    select: {
      members: {
        where: {
          NOT: {
            role: ProjectMemberRole.FOLLOWER,
          },
        },
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              email: true,
            },
          },
        },
      },
      invites: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  })

  return {
    memberSettings: {
      members: project!.members,
      invites: project!.invites,
    },
  }
}

export const getProjectRoadmaps = async (
  slug: string
): Promise<Promise<Omit<RoadmapsPageProps, "project">>> => {
  const roadmaps = await db.projectRoadmap.findMany({
    where: {
      project: {
        slug,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      name: true,
      description: true,
      slug: true,
      dueTo: true,
    },
  })

  return { roadmaps }
}

export const getProjectRoadmap = async (
  projectSlug: string,
  roadmapSlug: string | null
): Promise<Omit<RoadmapPageProps, "project"> | null> => {
  if (!roadmapSlug) return null

  const roadmap = await db.projectRoadmap.findFirst({
    where: {
      project: {
        slug: projectSlug,
      },
      slug: roadmapSlug,
    },
    select: {
      id: true,
      name: true,
      description: true,
      dueTo: true,
      feedback: {
        orderBy: {
          createdAt: "desc",
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
      },
    },
  })

  if (!roadmap) return null

  const { feedback, ...otherProps } = roadmap

  const totalCount = feedback.length

  const closedFeedbackCount = feedback.filter(
    ({ content: { status } }) =>
      status === FeedbackStatus.BLOCKED ||
      status === FeedbackStatus.CANCELED ||
      status === FeedbackStatus.COMPLETED
  ).length

  const progress = countProgress(totalCount, closedFeedbackCount)

  return {
    roadmap: {
      ...otherProps,
      progress,
      feedback: feedback.map(({ upvotedBy, ...otherProps }) => ({
        ...otherProps,
        upvotedBy: upvotedBy.map(({ id }) => id),
      })),
    },
  }
}
