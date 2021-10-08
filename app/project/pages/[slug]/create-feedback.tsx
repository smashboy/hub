import { ProjectMemberRole } from "db"
import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { authConfig } from "app/core/configs/authConfig"
import { getProjectInfo, ProjectPageProps } from "../../helpers"
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

export const getServerSideProps: GetServerSideProps<ProjectPageProps> = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession(req, res)
  const slug = (params?.slug as string) || null

  const props = await getProjectInfo(slug, session, [
    ProjectMemberRole.ADMIN,
    ProjectMemberRole.FOLLOWER,
    ProjectMemberRole.FOUNDER,
    ProjectMemberRole.MEMBER,
    ProjectMemberRole.MODERATOR,
  ])

  if (!props)
    return {
      notFound: true,
    }

  return {
    props,
  }
}

export default CreateFeedbackPage
