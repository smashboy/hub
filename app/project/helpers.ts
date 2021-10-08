import db, { ProjectMemberRole } from "db"
import { SessionContext } from "blitz"

export type ProjectPageProps = {
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

// const session = await getSession(req, res)
// const userId = session?.userId || undefined
// const slug = (params?.slug as string) || null

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

  if (isPrivate && isFollowing) return null

  const props: ProjectPageProps = {
    project: { ...otherProjectProps, slug, isFollowing, isPrivate },
  }

  if (!allowedRoles) return props

  if (!allowedRoles.includes(member?.role) || (isPrivate && isFollowing)) return null

  return props
}
