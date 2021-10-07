import { BlitzPage } from "blitz"
import { authConfig } from "app/core/configs/authConfig"
import { getProjectInfo, ProjectPageProps } from "../../common"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import FeedbackEditor from "app/project/components/FeedbackEditor"

const CreateFeedbackPage: BlitzPage<ProjectPageProps> = ({
  project: { slug },
}: ProjectPageProps) => {
  return <FeedbackEditor slug={slug} />
}

CreateFeedbackPage.authenticate = authConfig

CreateFeedbackPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectMiniLayout title={`${props.project.name} Feedback`} {...props}>
    {page}
  </ProjectMiniLayout>
)

export const getServerSideProps = getProjectInfo

export default CreateFeedbackPage
