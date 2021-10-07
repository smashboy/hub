import { useState } from "react"
import { useQuery } from "blitz"
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
  ListItemText,
  Box,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DialogForm from "app/core/components/DialogForm"
import getCreateFeedbackInfo from "../../queries/getCreateFeedbackInfo"
import { CreateLabel } from "../../validations"
import LabeledTextField from "app/core/components/LabeledTextField"
import ColorPicker from "app/core/components/ColorPicker"
import randomcolor from "randomcolor"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import createLabel from "../../mutations/createLabel"
import { FORM_ERROR } from "app/core/components/Form"
import { useFeedbackEditor } from "app/project/store/FeedbackEditorContext"

const generateNewLabelValues = () => ({
  name: "",
  color: randomcolor(),
  description: "",
})

const FeedbackSidebar = () => {
  const { slug } = useFeedbackEditor()

  const [project, { refetch }] = useQuery(getCreateFeedbackInfo, {
    slug,
  })

  const projectLabels = project.settings?.labels || []

  const [createLabelMutation] = useCustomMutation(createLabel, {
    successNotification: "New label has been created successfully!",
  })

  const [openCreateLabelDialog, setOpenCreateLabelDialog] = useState(false)

  const handleOpenCreateLabelDialog = () => setOpenCreateLabelDialog(true)
  const handleCloseCreateLabelDialog = () => setOpenCreateLabelDialog(false)

  return (
    <>
      <Fade in timeout={500}>
        <Paper
          variant="outlined"
          sx={{ padding: 1, width: "100%", height: "calc(100% - 16px)", bgcolor: "transparent" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                options={project.members}
                fullWidth
                freeSolo
                multiple
                size="small"
                renderOption={(props, { user: { username, id } }, { selected }) =>
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
                  members.map(({ user: { username, id } }, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      avatar={<Avatar alt={username} src="broken" />}
                      variant="outlined"
                      label={username}
                      key={id}
                    />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="Assigned" />}
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
                freeSolo
                disablePortal
                multiple
                renderOption={(props, { name, id, color, description }, { selected }) =>
                  selected ? null : (
                    <MenuItem
                      {...props}
                      key={id}
                      divider
                      sx={{ display: "flex", flexWrap: "wrap" }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Chip
                          label={name}
                          size="small"
                          sx={{ bgcolor: color, cursor: "pointer" }}
                        />
                      </Box>

                      {description && (
                        <ListItemText secondary={description} sx={{ paddingTop: 1 }} />
                      )}
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
                options={project.roadmaps}
                freeSolo
                disablePortal
                multiple
                renderOption={(props, { title, id }, { selected }) =>
                  selected ? null : (
                    <MenuItem {...props} key={id} divider>
                      {title}
                    </MenuItem>
                  )
                }
                renderTags={(roadmaps, getTagProps) =>
                  roadmaps.map(({ title, id }, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      variant="outlined"
                      label={title}
                      key={title}
                    />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="Roadmap" />}
              />
            </Grid>
          </Grid>
        </Paper>
      </Fade>
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

export default FeedbackSidebar
