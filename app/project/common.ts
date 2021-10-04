import db from "db"
import { GetServerSideProps } from "blitz"

export type ProjectPageProps = {
  project: {
    name: string
    slug: string
    color: string
    isPrivate: boolean
    description: string | null
    websiteUrl: string | null
    logoUrl: string | null
  }
}

export const getProjectInfo: GetServerSideProps = async (ctx) => {
  const slug = (ctx.params?.slug as string) || null

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
    },
  })

  if (!project)
    return {
      notFound: true,
    }

  const props: ProjectPageProps = {
    project: { ...project, slug },
  }

  return {
    props,
  }
}
