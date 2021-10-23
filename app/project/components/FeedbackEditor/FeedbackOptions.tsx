import { useState } from "react"
import { useQuery } from "blitz"
import { Global } from "@emotion/react"
import { styled } from "@mui/material/styles"
import {
  Paper,
  Grid,
  Autocomplete,
  TextField,
  Fade,
  Chip,
  Avatar,
  Button,
  Divider,
  MenuItem,
  ListItemAvatar,
  Container,
  ListItemText,
  Box,
  CssBaseline,
  SwipeableDrawer,
} from "@mui/material"
import { grey } from "@mui/material/colors"
import AddIcon from "@mui/icons-material/Add"
import DialogForm from "app/core/components/DialogForm"
import getFeedbackOptions from "../../queries/getFeedbackOptions"
import { CreateLabel } from "../../validations"
import LabeledTextField from "app/core/components/LabeledTextField"
import ColorPicker from "app/core/components/ColorPicker"
import randomcolor from "randomcolor"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import createLabel from "../../mutations/createLabel"
import { FORM_ERROR } from "app/core/components/Form"
import { useFeedbackEditor } from "app/project/store/FeedbackEditorContext"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}))

const generateNewLabelValues = () => ({
  name: "",
  color: randomcolor(),
  description: "",
})

const Options = () => {
  const { slug, setMembers, setLabels, setRoadmaps, labelIds, memberIds, roadmapIds } =
    useFeedbackEditor()

  const [project, { refetch }] = useQuery(
    getFeedbackOptions,
    {
      slug,
    },
    {
      refetchOnWindowFocus: false,
    }
  )

  const projectLabels = project.settings?.labels || []
  const projectRoadmaps = project.roadmaps

  const [createLabelMutation] = useCustomMutation(createLabel, {
    successNotification: "New label has been created successfully!",
  })

  const [openCreateLabelDialog, setOpenCreateLabelDialog] = useState(false)

  const handleOpenCreateLabelDialog = () => setOpenCreateLabelDialog(true)
  const handleCloseCreateLabelDialog = () => setOpenCreateLabelDialog(false)

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            options={project.members}
            value={project.members.filter((member) => memberIds.includes(member.id))}
            getOptionLabel={({ user: { username } }) => username}
            fullWidth
            freeSolo
            multiple
            onChange={(event, value) => {
              // @ts-ignore
              setMembers(value.map(({ id }) => id))
            }}
            size="small"
            renderOption={(props, { id, user: { username } }, { selected }) =>
              selected ? null : (
                <MenuItem {...props} key={id} divider>
                  <ListItemAvatar>
                    <Avatar alt={username} src="broken" sx={{ width: 24, height: 24 }} />
                  </ListItemAvatar>
                  <ListItemText primary={username} />
                </MenuItem>
              )
            }
            renderTags={(members, getTagProps) =>
              members.map(({ id, user: { username } }, index) => (
                <Chip
                  {...getTagProps({ index })}
                  avatar={<Avatar alt={username} src="broken" />}
                  variant="outlined"
                  label={username}
                  key={id}
                />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Participants" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            size="small"
            fullWidth
            options={projectLabels}
            value={projectLabels.filter((label) => labelIds.includes(label.id))}
            getOptionLabel={({ name }) => name}
            freeSolo
            disablePortal
            multiple
            onChange={(event, value) => {
              // @ts-ignore
              setLabels(value.map(({ id }) => id))
            }}
            renderOption={(props, { name, id, color, description }, { selected }) =>
              selected ? null : (
                <MenuItem {...props} key={id} divider sx={{ display: "flex", flexWrap: "wrap" }}>
                  <Box sx={{ width: "100%" }}>
                    <Chip label={name} size="small" sx={{ bgcolor: color, cursor: "pointer" }} />
                  </Box>

                  {description && <ListItemText secondary={description} sx={{ paddingTop: 1 }} />}
                </MenuItem>
              )
            }
            renderTags={(labels, getTagProps) =>
              labels.map(({ id, color, name }, index) => (
                <Chip
                  {...getTagProps({ index })}
                  label={name}
                  key={id}
                  size="small"
                  sx={{ bgcolor: color }}
                />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Labels" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={handleOpenCreateLabelDialog}
            size="small"
            endIcon={<AddIcon />}
            fullWidth
          >
            New Label
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            size="small"
            fullWidth
            options={projectRoadmaps}
            value={projectRoadmaps.filter((roadmap) => roadmapIds.includes(roadmap.id))}
            getOptionLabel={({ name }) => name}
            freeSolo
            disablePortal
            multiple
            onChange={(event, value) => {
              // @ts-ignore
              setRoadmaps(value.map(({ id }) => id))
            }}
            renderOption={(props, { name, id }, { selected }) =>
              selected ? null : (
                <MenuItem {...props} key={id} divider>
                  {name}
                </MenuItem>
              )
            }
            renderTags={(roadmaps, getTagProps) =>
              roadmaps.map(({ name, id }, index) => (
                <Chip {...getTagProps({ index })} variant="outlined" label={name} key={id} />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Roadmap" />}
          />
        </Grid>
      </Grid>
      <DialogForm
        open={openCreateLabelDialog}
        title="New label"
        submitText="Create"
        DialogProps={{
          maxWidth: "sm",
        }}
        schema={CreateLabel.omit({ projectSlug: true })}
        initialValues={generateNewLabelValues}
        onClose={handleCloseCreateLabelDialog}
        onSubmit={async (values) => {
          try {
            await createLabelMutation({ ...values, projectSlug: slug })
            refetch()
          } catch (error) {
            return {
              [FORM_ERROR]:
                "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
            }
          }
        }}
      >
        <LabeledTextField name="name" label="Name" size="small" />
        <ColorPicker name="color" label="Color" />
        <LabeledTextField name="description" label="Description" multiline rows={3} maxRows={3} />
      </DialogForm>
    </>
  )
}

export const feedbackOptionsDrawerBleeding = 56

const FeedbackOptions = () => {
  const isSM = useIsSmallDevice()

  const [open, setOpen] = useState(false)

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen)

  // This is used only for the example
  const container = window !== undefined ? () => window.document.body : undefined

  return (
    <>
      {isSM ? (
        <>
          <CssBaseline />
          <Global
            styles={{
              ".MuiDrawer-root > .MuiPaper-root": {
                height: `calc(80% - ${feedbackOptionsDrawerBleeding}px)`,
                overflow: "visible",
                background: "#000",
              },
            }}
          />

          <SwipeableDrawer
            container={container}
            anchor="bottom"
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            swipeAreaWidth={feedbackOptionsDrawerBleeding}
            disableSwipeToOpen={false}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: -feedbackOptionsDrawerBleeding,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                visibility: "visible",
                bgcolor: "background.paper",
                right: 0,
                left: 0,
              }}
            >
              <Puller />
            </Box>
            <Container>
              <Options />
            </Container>
          </SwipeableDrawer>
        </>
      ) : (
        <Grid item xs={3}>
          <Fade in timeout={500}>
            <Paper variant="outlined" sx={{ padding: 1, width: "100%", bgcolor: "transparent" }}>
              <Options />
            </Paper>
          </Fade>
        </Grid>
      )}
    </>
  )
}

export default FeedbackOptions
