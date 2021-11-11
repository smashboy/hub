import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { authConfig } from "app/core/configs/authConfig"
import { getProjectInfo, ProjectPageProps } from "../../../helpers"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import FeedbackEditor from "app/project/components/FeedbackEditor"

const CreateFeedbackPage: BlitzPage<ProjectPageProps> = () => {
  return <FeedbackEditor />
}

CreateFeedbackPage.authenticate = authConfig

CreateFeedbackPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectMiniLayout title={`New feedback ${props.project.name}`} {...props}>
    {page}
  </ProjectMiniLayout>
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

export default CreateFeedbackPage
