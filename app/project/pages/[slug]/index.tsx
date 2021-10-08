import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import { getProjectInfo, ProjectPageProps } from "app/project/helpers"
import ProjectLayout from "app/project/layouts/ProjectLayout"

const ProjectLandingPage: BlitzPage<ProjectPageProps> = ({ project }) => {
  return <div />
}

ProjectLandingPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectLayout title={props.project.name} selectedTab="landing" {...props}>
    {page}
  </ProjectLayout>
)

export const getServerSideProps: GetServerSideProps<ProjectPageProps> = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession(req, res)
  const slug = (params?.slug as string) || null

  const props = await getProjectInfo(slug, session)

  if (!props)
    return {
      notFound: true,
    }

  return {
    props,
  }
}

export default ProjectLandingPage
