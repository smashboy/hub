import db, { ProjectMemberRole } from "db"
import { GetServerSideProps, getSession } from "blitz"

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

export const getProjectInfo: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getSession(req, res)

  const userId = session?.userId || undefined

  const slug = (params?.slug as string) || null

  if (!slug)
    return {
      notFound: true,
    }

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

  if (!project)
    return {
      notFound: true,
    }

  const { members, ...otherProjectProps } = project

  const isFollowing = !members[0]
    ? false
    : members[0].role !== ProjectMemberRole.FOLLOWER
    ? null
    : true

  const props: ProjectPageProps = {
    project: { ...otherProjectProps, slug, isFollowing },
  }

  return {
    props,
  }
}
