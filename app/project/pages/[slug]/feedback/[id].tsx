import { useState } from "react"
import { BlitzPage, GetServerSideProps, getSession, useQuery } from "blitz"
import { Grid, Divider, Tabs, Tab, Container } from "@mui/material"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import FeedbackEditor from "app/project/components/FeedbackEditor"
import { getProjectInfo, getFeedback, FeedbackPageProps } from "app/project/helpers"
import getAbility from "app/guard/queries/getAbility"
import { Suspense } from "react"
import FeedbackMessagesList from "app/project/components/FeedbackMessagesList"

const SelectedFeedbackPage: BlitzPage<FeedbackPageProps> = ({
  project: { slug },
  feedback,
}: FeedbackPageProps) => {
  const [res] = useQuery(
    getAbility,
    [
      ["read", "feedback.messages.private", slug],
      ["update", "feedback.settings", slug],
    ],
    {
      suspense: false,
      refetchOnWindowFocus: false,
    }
  )

  const [selectedMessagesCategory, setSelectedMessagesCategory] = useState(1)

  const canReadPrivateMessages = res?.[0]?.can || false
  const canManageSettings = res?.[1]?.can || false

  const handleSelectMessagesCategory = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedMessagesCategory(newValue)
  }

  return (
    <Container maxWidth={canManageSettings ? "xl" : "md"}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FeedbackEditor slug={slug} initialValues={{ feedback }} />
        </Grid>
        <Grid container item xs={12} md={canManageSettings ? 9 : 12} spacing={2}>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {canReadPrivateMessages && (
            <Grid item xs={12}>
              <Tabs value={selectedMessagesCategory} onChange={handleSelectMessagesCategory}>
                <Tab value={1} label="Public" />
                <Tab value={0} label="Private" />
              </Tabs>
            </Grid>
          )}
          <Suspense fallback={null}>
            <FeedbackMessagesList
              feedbackId={feedback.id}
              isPublic={Boolean(selectedMessagesCategory)}
            />
          </Suspense>
        </Grid>
      </Grid>
    </Container>
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
