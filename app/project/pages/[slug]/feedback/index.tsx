import { Suspense } from "react"
import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Grid } from "@mui/material"
import { getProjectInfo, ProjectPageProps } from "app/project/helpers"
import ProjectLayout from "app/project/layouts/ProjectLayout"
import FeedbackListHeader from "app/project/components/FeedbackListHeader"
import FeedbackList from "app/project/components/FeedbackList"
import FeedbackListPlaceholder from "app/project/components/FeedbackListPlaceholder"

const FeedbackPage: BlitzPage<ProjectPageProps> = ({
  project: { slug, role },
}: ProjectPageProps) => {
  return (
    <Grid container spacing={1} sx={{ marginTop: 1 }}>
      <FeedbackListHeader />
      <Grid item xs={12}>
        <Suspense fallback={<FeedbackListPlaceholder />}>
          <FeedbackList slug={slug} role={role} />
        </Suspense>
      </Grid>
    </Grid>
  )
}

FeedbackPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectLayout title={props.project.name} selectedTab="feedback" {...props}>
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

export default FeedbackPage
