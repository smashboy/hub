import { BlitzPage, GetServerSideProps, getSession, Routes } from "blitz"
import { Grid, List } from "@mui/material"
import { getProjectInfo, getProjectRoadmaps, RoadmapsPageProps } from "app/project/helpers"
import ProjectLayout from "app/project/layouts/ProjectLayout"
import { ButtonRouteLink } from "app/core/components/links"
import RoadmapListItem from "app/project/components/RoadmapListItem"
import { ProjectMemberRole } from "db"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"

const RoadmapsPage: BlitzPage<RoadmapsPageProps> = ({
  project: { slug, role },
  roadmaps,
}: RoadmapsPageProps) => {
  const isSM = useIsSmallDevice()

  return (
    <Grid container spacing={1} sx={{ marginTop: 1 }}>
      {role && role !== ProjectMemberRole.MEMBER && (
        <Grid container item xs={12} justifyContent="flex-end">
          <ButtonRouteLink
            href={Routes.NewRoadmapPage({ slug })}
            variant="contained"
            fullWidth={isSM}
          >
            New Roadmap
          </ButtonRouteLink>
        </Grid>
      )}
      <Grid item xs={12}>
        <List component="div">
          {roadmaps.map((roadmap) => (
            <RoadmapListItem key={roadmap.slug} roadmap={roadmap} projectSlug={slug} />
          ))}
        </List>
      </Grid>
    </Grid>
  )
}

RoadmapsPage.getLayout = (page, props: RoadmapsPageProps) => (
  <ProjectLayout title={props.project.name} selectedTab="roadmap" {...props}>
    {page}
  </ProjectLayout>
)

export const getServerSideProps: GetServerSideProps<RoadmapsPageProps> = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession(req, res)
  const slug = (params?.slug as string) || null

  const project = await getProjectInfo(slug, session)

  if (!project)
    return {
      notFound: true,
    }

  const roadmaps = await getProjectRoadmaps(slug!)

  return {
    props: { ...project, ...roadmaps },
  }
}

export default RoadmapsPage
