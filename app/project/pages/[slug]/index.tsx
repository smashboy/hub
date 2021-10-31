import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Typography, Grid } from "@mui/material"
import { getProjectInfo, ProjectPageProps } from "app/project/helpers"
import ProjectLayout from "app/project/layouts/ProjectLayout"

const ProjectLandingPage: BlitzPage<ProjectPageProps> = () => {
  return (
    <Grid container sx={{ marginTop: 2 }}>
      <Grid container item xs={12} justifyContent="center">
        <Typography variant="overline" textAlign="center" color="text.primary">
          Coming Soon
        </Typography>
      </Grid>
    </Grid>
  )
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
