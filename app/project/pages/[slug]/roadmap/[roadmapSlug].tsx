import { useState } from "react"
import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { format } from "date-fns"
import { Grid, Typography, Divider, Button, Container } from "@mui/material"
import { getProjectInfo, getProjectRoadmap, RoadmapPageProps } from "app/project/helpers"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import RoadmapBoard from "app/project/components/RoadmapBoard"
import UpdateRoadmapDialog from "app/project/components/UpdateRoadmapDialog"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { ProjectMemberRole } from "db"

const RoadmapPage: BlitzPage<RoadmapPageProps> = ({
  roadmap: { id, feedback, ...roadmap },
  project: { slug: projectSlug, role },
}: RoadmapPageProps) => {
  const user = useCurrentUser(false)

  const [open, setOpen] = useState(false)

  const [{ name, description, dueTo }, setInfo] = useState(roadmap)

  const handleOpenDialog = () => setOpen(true)
  const handleCloseDialog = () => setOpen(false)

  const canManage = Boolean(
    user &&
      (role === ProjectMemberRole.FOUNDER ||
        role === ProjectMemberRole.ADMIN ||
        role === ProjectMemberRole.MODERATOR)
  )

  return (
    <>
      <Grid container sx={{ marginTop: 2 }}>
        <Container>
          <Grid container item spacing={1} xs={12}>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid container item xs={9} md={10}>
              <Grid item xs={12}>
                <Typography variant="h5" color="text.primary" component="div">
                  {name}
                </Typography>
              </Grid>
              {description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    {description}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" component="div">
                  {dueTo ? `Due by ${format(dueTo, "dd MMMM, yyyy")}` : "No due date"}
                </Typography>
              </Grid>
            </Grid>
            {canManage && (
              <Grid container item xs={3} md={2} alignItems="center">
                <Button variant="contained" onClick={handleOpenDialog} fullWidth>
                  Edit
                </Button>
              </Grid>
            )}
          </Grid>
        </Container>
        <RoadmapBoard feedback={feedback} canManage={canManage} />
      </Grid>
      <UpdateRoadmapDialog
        open={open}
        onClose={handleCloseDialog}
        onUpdate={(updatedRoadmap) => setInfo(updatedRoadmap)}
        projectSlug={projectSlug}
        roadmap={{
          id,
          name,
          description,
          dueTo,
        }}
      />
    </>
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
