import { BlitzPage, GetServerSideProps, getSession, Routes } from "blitz"
import { Grid } from "@mui/material"
import { getProjectInfo, ProjectPageProps } from "app/project/helpers"
import ProjectLayout from "app/project/layouts/ProjectLayout"
import { ButtonRouteLink } from "app/core/components/links"

const RoadmapPage: BlitzPage<ProjectPageProps> = ({ project: { slug } }: ProjectPageProps) => {
  return (
    <Grid container spacing={2} sx={{ marginTop: 2 }}>
      <Grid item xs={12}>
        <ButtonRouteLink href={Routes.NewRoadmapPage({ slug })} variant="contained" fullWidth>
          New Roadmap
        </ButtonRouteLink>
      </Grid>
    </Grid>
  )
}

RoadmapPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectLayout title={props.project.name} selectedTab="roadmap" {...props}>
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

export default RoadmapPage
