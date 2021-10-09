import db, { FeedbackCategory, ProjectMemberRole } from "db"
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
    isFollowing: boolean | null
  }
}

export interface FeedbackPageProps extends ProjectPageProps {
  feedback: {
    id: number
    createdAt: Date
    title: string
    category: FeedbackCategory
    content: string
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
      user: {
        id: number
        username: string
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
      content: {
        select: {
          id: true,
          createdAt: true,
          title: true,
          category: true,
          content: true,
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
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  })

  if (!feedback) return null

  const { content, ...otherProps } = feedback

  return { feedback: { ...otherProps, ...content } }
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

  const isFollowing = !members[0]
    ? false
    : members[0].role !== ProjectMemberRole.FOLLOWER
    ? null
    : true

  if (isPrivate && (!member || isFollowing)) return null

  const props: ProjectPageProps = {
    project: { ...otherProjectProps, slug, isFollowing, isPrivate },
  }

  if (!allowedRoles) return props

  if (!allowedRoles.includes(member?.role)) return null

  return props
}
