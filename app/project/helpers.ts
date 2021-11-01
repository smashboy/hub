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
    isFollowing: boolean
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
  roadmaps: Array<{
    name: string
    description: string | null
    slug: string
    dueTo: Date | null
    progress: number
  }>
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
    slug: string
    name: string
    isArchived: boolean
    description: string | null
    dueTo: Date | null
    progress: number
    feedback: Array<RoadmapFeedback>
  }
}

export interface ChangelogPageProps extends ProjectPageProps {
  changelog: {
    id: number
    createdAt: Date
    title: string
    content: string
    userRating: number | null
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
        // where: {
        //   isArchived: false,
        // },
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
      id: true,
      name: true,
      color: true,
      isPrivate: true,
      description: true,
      websiteUrl: true,
      logoUrl: true,
      followers: {
        where: {
          id: userId,
        },
      },
    },
  })

  if (!project) return null

  const { isPrivate, followers, ...otherProjectProps } = project

  let member: {
    role: ProjectMemberRole
  } | null = null

  if (userId) {
    member = await db.projectMember.findUnique({
      where: {
        projectId_userId: {
          userId,
          projectId: project.id,
        },
      },
      select: {
        role: true,
      },
    })
  }

  if (isPrivate && !member) return null

  const props: ProjectPageProps = {
    project: {
      ...otherProjectProps,
      slug,
      role: member?.role || null,
      isPrivate,
      isFollowing: followers.length === 1,
    },
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
          notifications: {
            select: {
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
      },
    },
  })

  return {
    memberSettings: {
      members: project!.members,
      invites: project!.invites.map(({ notifications: { user }, ...otherProps }) => ({
        ...otherProps,
        user,
      })),
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
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      name: true,
      description: true,
      slug: true,
      dueTo: true,
      feedback: {
        select: {
          content: {
            select: {
              status: true,
            },
          },
        },
      },
    },
  })

  return {
    roadmaps: roadmaps.map(({ feedback, ...otherProps }) => {
      const totalCount = feedback.length

      const closedFeedbackCount = feedback.filter(
        ({ content: { status } }) =>
          status === FeedbackStatus.BLOCKED ||
          status === FeedbackStatus.CANCELED ||
          status === FeedbackStatus.COMPLETED
      ).length

      const progress = countProgress(totalCount, closedFeedbackCount)

      return { ...otherProps, progress }
    }),
  }
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
      isArchived: true,
      feedback: {
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
      slug: roadmapSlug,
      ...otherProps,
      progress,
      feedback: feedback.map(({ upvotedBy, ...otherProps }) => ({
        ...otherProps,
        upvotedBy: upvotedBy.map(({ id }) => id),
      })),
    },
  }
}

export const getChangelog = async (
  projectSlug: string,
  session: SessionContext,
  changelogSlug: string | null
): Promise<Omit<ChangelogPageProps, "project"> | null> => {
  if (!changelogSlug) return null

  const userId = session?.userId || undefined

  const changelog = await db.projectChangelog.findFirst({
    where: {
      slug: changelogSlug,
      project: {
        slug: projectSlug,
      },
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      content: true,
    },
  })

  if (!changelog) return null

  let userRating: number | null = null

  if (userId) {
    const feedback = await db.changelogFeedback.findUnique({
      where: {
        userId_changelogId: {
          userId,
          changelogId: changelog.id,
        },
      },
      select: {
        rating: true,
      },
    })

    if (feedback) userRating = feedback.rating
  }

  return { changelog: { ...changelog, userRating } }
}
