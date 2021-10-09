import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Grid } from "@mui/material"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import FeedbackEditor from "app/project/components/FeedbackEditor"
import { getProjectInfo, getFeedback, FeedbackPageProps } from "app/project/helpers"

const SelectedFeedbackPage: BlitzPage<FeedbackPageProps> = ({
  project: { slug },
  feedback,
}: FeedbackPageProps) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <FeedbackEditor slug={slug} initialValues={{ feedback }} />
      </Grid>
    </Grid>
  )
}

SelectedFeedbackPage.getLayout = (page, props: FeedbackPageProps) => (
  <ProjectMiniLayout title={props.project.name} {...props}>
    {page}
  </ProjectMiniLayout>
)

export const getServerSideProps: GetServerSideProps<FeedbackPageProps> = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession(req, res)
  const projectSlug = (params?.slug as string) || null
  const feedbackId = parseInt(params?.id as string) || null

  const projectProps = await getProjectInfo(projectSlug, session)

  if (!projectProps)
    return {
      notFound: true,
    }

  const feedbackProps = await getFeedback(projectSlug!, feedbackId)

  if (!feedbackProps)
    return {
      notFound: true,
    }

  return {
    props: { ...projectProps, ...feedbackProps },
  }
}

export default SelectedFeedbackPage
