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
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DialogForm from "app/core/components/DialogForm"
import getCreateFeedbackInfo from "../queries/getCreateFeedbackInfo"
import { CreateLabel } from "../validations"
import LabeledTextField from "app/core/components/LabeledTextField"
import ColorPicker from "app/core/components/ColorPicker"
import randomcolor from "randomcolor"

const generateNewLabelValues = () => ({
  name: "",
  color: randomcolor(),
  description: "",
})

const FeedbackSidebar: React.FC<{ slug: string }> = ({ slug }) => {
  const [project] = useQuery(getCreateFeedbackInfo, {
    slug,
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
                options={project.members.map(({ user: { username } }) => username)}
                fullWidth
                freeSolo
                multiple
                size="small"
                renderTags={(members: readonly string[], getTagProps) =>
                  members.map((username, index) => (
                    <Chip
                      avatar={<Avatar alt={username} src="broken" />}
                      variant="outlined"
                      label={username}
                      {...getTagProps({ index })}
                      key={username}
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
        schema={CreateLabel}
        initialValues={generateNewLabelValues}
        onClose={handleCloseCreateLabelDialog}
        onSubmit={async () => {}}
      >
        <LabeledTextField name="name" label="Name" size="small" />
        <ColorPicker name="color" label="Color" />
        <LabeledTextField name="description" label="Description" multiline rows={3} maxRows={3} />
      </DialogForm>
    </>
  )
}

export default FeedbackSidebar
