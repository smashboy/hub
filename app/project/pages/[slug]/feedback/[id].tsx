import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Grid, Divider } from "@mui/material"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import FeedbackEditor from "app/project/components/FeedbackEditor"
import { getProjectInfo, getFeedback, FeedbackPageProps } from "app/project/helpers"
import FeedbackMessageEditor from "app/project/components/FeedbackMessageEditor"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
const SelectedFeedbackPage: BlitzPage<FeedbackPageProps> = ({
  project: { slug },
  feedback,
}: FeedbackPageProps) => {
  const user = useCurrentUser(false)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FeedbackEditor slug={slug} initialValues={{ feedback }} />
      </Grid>
      {user && (
        <Grid container item xs={12} md={9} spacing={2}>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <FeedbackMessageEditor />
          </Grid>
        </Grid>
      )}
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
