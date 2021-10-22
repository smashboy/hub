import { useState, useMemo } from "react"
import { Routes } from "blitz"
import { format } from "date-fns"
import {
  Grid,
  Typography,
  Button,
  Container,
  LinearProgress,
  Divider,
  Avatar,
  TextField,
  MenuItem,
  GridSize,
} from "@mui/material"
import BuildChangelogIcon from "@mui/icons-material/LibraryBooks"
import EditIcon from "@mui/icons-material/Edit"
import UpdateRoadmapDialog from "app/project/components/UpdateRoadmapDialog"
import { useRoadmap } from "app/project/store/RoadmapContext"
import { ButtonRouteLink, RouteLink } from "./links"
import { useIsSmallDevice } from "../hooks/useIsSmallDevice"
import { feedbackOptions } from "app/project/components/FeedbackEditor/Header"
import { CategoryType } from "app/project/store/FeedbackEditorContext"

const RoadmapHeader = () => {
  const {
    info: { name, description, dueTo, id, progress, slug },
    setInfo,
    filterRoadmap,
    canManage,
    projectSlug,
  } = useRoadmap()

  const isSM = useIsSmallDevice()

  const avatarSize = useMemo(() => (isSM ? 45 : 75), [isSM])

  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<CategoryType>("none")

  const handleOpenDialog = () => setOpen(true)
  const handleCloseDialog = () => setOpen(false)

  const handleCategory = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = event.target.value as CategoryType

    setCategory(newCategory)

    await filterRoadmap(newCategory === "none" ? null : newCategory)
  }

  const descriptionLayoutSize = useMemo(() => {
    let size = 8

    if (progress === 100 && canManage) return (size -= 2)
    if (canManage) return (size -= 1)
    return size
  }, [progress, canManage]) as GridSize

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
          <Grid container item xs={10} md={descriptionLayoutSize}>
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
              <Grid container item xs={12} md={6} spacing={1} sx={{ paddingTop: 1 }}>
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
          <Grid container item xs={12} md={3} alignItems="center">
            <TextField
              label="Category"
              size="small"
              value={category}
              onChange={handleCategory}
              fullWidth
              select
            >
              {feedbackOptions.map(({ label, value }) => (
                <MenuItem key={label} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {canManage && (
            <Grid container item xs={6} md={1} alignItems="center">
              <Button variant="contained" onClick={handleOpenDialog} fullWidth>
                <EditIcon />
              </Button>
            </Grid>
          )}
          {progress === 100 && canManage && (
            <Grid container item xs={6} md={1} alignItems="center">
              <ButtonRouteLink
                href={Routes.CreateChangelog({ slug: projectSlug, roadmapSlug: slug })}
                variant="contained"
                color="secondary"
                fullWidth
              >
                <BuildChangelogIcon />
              </ButtonRouteLink>
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
