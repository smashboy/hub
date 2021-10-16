import db, { FeedbackCategory, ProjectMemberRole, FeedbackStatus } from "db"
import { SessionContext } from "blitz"

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
