import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Grid } from "@mui/material"
import { getProjectInfo, getProjectRoadmap, RoadmapPageProps } from "app/project/helpers"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import RoadmapBoard from "app/project/components/RoadmapBoard"
import { RoadmapProvider } from "app/project/store/RoadmapContext"
import RoadmapHeader from "app/core/components/RoadmapHeader"

const RoadmapPage: BlitzPage<RoadmapPageProps> = ({
  roadmap,
  project: { slug: projectSlug, role },
}: RoadmapPageProps) => {
  return (
    <RoadmapProvider projectSlug={projectSlug} roadmap={roadmap} memberRole={role}>
      <Grid container rowSpacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12}>
          <RoadmapHeader />
        </Grid>
        <Grid item xs={12}>
          <RoadmapBoard />
        </Grid>
      </Grid>
    </RoadmapProvider>
  )
}

RoadmapPage.getLayout = (page, props: RoadmapPageProps) => (
  <ProjectMiniLayout title={props.project.name} {...props} disableContainer>
    {page}
  </ProjectMiniLayout>
)

export const getServerSideProps: GetServerSideProps<RoadmapPageProps> = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession(req, res)
  const slug = (params?.slug as string) || null
  const roadmapSlug = (params?.roadmapSlug as string) || null

  const project = await getProjectInfo(slug, session)

  if (!project)
    return {
      notFound: true,
    }

  const roadmap = await getProjectRoadmap(slug!, roadmapSlug)

  if (!roadmap)
    return {
      notFound: true,
    }

  return {
    props: { ...project, ...roadmap },
  }
}

export default RoadmapPage
