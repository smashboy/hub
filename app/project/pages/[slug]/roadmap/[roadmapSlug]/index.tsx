import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Grid, Fade } from "@mui/material"
import { getProjectInfo, getProjectRoadmap, RoadmapPageProps } from "app/project/helpers"
import RoadmapBoard from "app/project/components/RoadmapBoard"
import { RoadmapProvider } from "app/project/store/RoadmapContext"
import RoadmapHeader from "app/core/components/RoadmapHeader"
import Layout from "app/core/layouts/Layout"

const RoadmapPage: BlitzPage<RoadmapPageProps> = ({
  roadmap,
  project: { slug: projectSlug, role },
}: RoadmapPageProps) => {
  return (
    <RoadmapProvider projectSlug={projectSlug} roadmap={roadmap} memberRole={role}>
      <Grid container rowSpacing={2} sx={{ marginTop: 2 }}>
        <Fade in timeout={500}>
          <Grid item xs={12}>
            <RoadmapHeader />
          </Grid>
        </Fade>
        <Fade in timeout={750}>
          <Grid item xs={12}>
            <RoadmapBoard />
          </Grid>
        </Fade>
      </Grid>
    </RoadmapProvider>
  )
}

RoadmapPage.getLayout = (page, props: RoadmapPageProps) => (
  <Layout title={props.project.name} disableContainer>
    {page}
  </Layout>
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