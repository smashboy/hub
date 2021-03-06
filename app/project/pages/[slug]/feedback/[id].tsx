import { useState } from "react"
import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Grid, Tabs, Tab, Container } from "@mui/material"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import FeedbackEditor from "app/project/components/FeedbackEditor"
import { getProjectInfo, getFeedback, FeedbackPageProps } from "app/project/helpers"
import { Suspense } from "react"
import FeedbackMessagesList from "app/project/components/FeedbackMessagesList"
import { FeedbackMessageCategory } from "db"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const SelectedFeedbackPage: BlitzPage<FeedbackPageProps> = ({
  project: { role },
  feedback,
}: FeedbackPageProps) => {
  const user = useCurrentUser(false)
  const {
    author: { id },
  } = feedback

  const [selectedMessagesCategory, setSelectedMessagesCategory] = useState<FeedbackMessageCategory>(
    FeedbackMessageCategory.PUBLIC
  )

  const handleSelectMessagesCategory = (
    event: React.SyntheticEvent,
    newValue: FeedbackMessageCategory
  ) => {
    setSelectedMessagesCategory(newValue)
  }

  return (
    <Container maxWidth={role ? "xl" : "md"} disableGutters>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FeedbackEditor initialValues={{ feedback }} />
        </Grid>
        <Grid container item xs={12} md={role ? 9 : 12} spacing={2}>
          {(role || user?.id === id) && (
            <Grid item xs={12}>
              <Tabs value={selectedMessagesCategory} onChange={handleSelectMessagesCategory}>
                {(user?.id === id || role) && (
                  <Tab value={FeedbackMessageCategory.PUBLIC} label="Public" />
                )}
                {(user?.id === id || role) && (
                  <Tab value={FeedbackMessageCategory.PRIVATE} label="Private" />
                )}
                {role && <Tab value={FeedbackMessageCategory.INTERNAL} label="Internal" />}
              </Tabs>
            </Grid>
          )}
          <Suspense fallback={null}>
            <FeedbackMessagesList feedbackId={feedback.id} category={selectedMessagesCategory} />
          </Suspense>
        </Grid>
      </Grid>
    </Container>
  )
}

SelectedFeedbackPage.getLayout = (page, props: FeedbackPageProps) => (
  <ProjectMiniLayout title={`${props.feedback.title} feedback | ${props.project.name}`} {...props}>
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
