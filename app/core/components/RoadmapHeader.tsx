import { useState, useMemo } from "react"
import { Routes } from "blitz"
import { format } from "date-fns"
import { Grid, Typography, Button, Container, LinearProgress, Divider, Avatar } from "@mui/material"
import UpdateRoadmapDialog from "app/project/components/UpdateRoadmapDialog"
import { useRoadmap } from "app/project/store/RoadmapContext"
import { RouteLink } from "./links"
import { useIsSmallDevice } from "../hooks/useIsSmallDevice"

const RoadmapHeader = () => {
  const {
    info: { name, description, dueTo, id, progress },
    setInfo,
    canManage,
    projectSlug,
  } = useRoadmap()

  const isSM = useIsSmallDevice()

  const avatarSize = useMemo(() => (isSM ? 45 : 75), [isSM])

  const [open, setOpen] = useState(false)

  const handleOpenDialog = () => setOpen(true)
  const handleCloseDialog = () => setOpen(false)

  return (
    <>
      <Container>
        <Grid container item spacing={1} xs={12}>
          <Grid container item xs={2} md={1} alignItems="center">
            <RouteLink href={Routes.ProjectLandingPage({ slug: projectSlug })}>
              <Avatar
                src="broken"
                alt={name}
                sx={{
                  // bgcolor: color,
                  width: avatarSize,
                  height: avatarSize,
                  fontSize: 32,
                  marginRight: 3,
                }}
              />
            </RouteLink>
          </Grid>
          <Grid container item xs={9}>
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
            {progress !== null && (
              <Grid container item xs={12} md={4} spacing={1} sx={{ paddingTop: 1 }}>
                <Grid item xs={12}>
                  <LinearProgress value={progress} variant="determinate" />
                </Grid>
                <Grid container item xs={12} justifyContent="flex-end">
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    component="div"
                  >{`${progress}% done`}</Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
          {canManage && (
            <Grid container item xs={12} md={2} alignItems="center">
              <Button variant="contained" onClick={handleOpenDialog} fullWidth>
                Edit
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
      </Container>
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

export default RoadmapHeader
