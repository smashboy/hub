import Layout from "app/core/layouts/Layout"
import { getProjectInfo, ProjectPageProps } from "app/project/common"
import ProjectLayout from "app/project/layouts/ProjectLayout"
import { BlitzPage } from "blitz"

const ProjectLandingPage: BlitzPage<ProjectPageProps> = ({ project }) => {
  return <div />
}

ProjectLandingPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectLayout title={props.project.name} selectedTab="landing" {...props}>
    {page}
  </ProjectLayout>
)

export const getServerSideProps = getProjectInfo

export default ProjectLandingPage
