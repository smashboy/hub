import { ProjectMemberRole } from "db"
import { useState } from "react"
import randomcolor from "randomcolor"
import { useFormContext, useWatch } from "react-hook-form"
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  Grid,
  ListItem,
  Chip,
  ListItemText,
  Paper,
  IconButton,
  Collapse,
  Typography,
} from "@mui/material"
import Dialog from "app/core/components/Dialog"
import LabelsIcon from "@mui/icons-material/Label"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { useFeedbackEditor } from "app/project/store/FeedbackEditorContext"
import Form, { FORM_ERROR } from "app/core/components/Form"
import { CreateLabel } from "app/project/validations"
import LabeledTextField from "app/core/components/LabeledTextField"
import ColorPicker from "app/core/components/ColorPicker"
import { SxProps } from "@mui/system"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import createLabel from "app/project/mutations/createLabel"
import { useConfirmDialog } from "react-mui-confirm"
import updateLabel from "app/project/mutations/updateLabel"
import deleteLabel from "app/project/mutations/deleteLabel"

type Label = {
  id: string
  name: string
  color: string
  description: string | null
}

type ManageLabelsDialogProps = {
  labels: Label[]
  refetch: () => void
}

type LabelFormProps = {
  initialValues?: Label
  onSuccess: () => void
  onCancel?: () => void
}

const LabelPreview = () => {
  const { control } = useFormContext()

  const color = useWatch({
    name: "color",
    control,
  })

  const name = useWatch({
    name: "name",
    control,
  })

  return <Chip label={name || "Label preview"} sx={{ bgcolor: color }} />
}

const LabelForm: React.FC<LabelFormProps> = ({ onSuccess, onCancel, initialValues }) => {
  const { slug } = useFeedbackEditor()

  const [createLabelMutation] = useCustomMutation(createLabel, {
    successNotification: "New label has been created successfully!",
  })

  const [updateLabelMutation] = useCustomMutation(updateLabel, {
    successNotification: "Label has been updated successfully!",
  })

  return (
    <Form
      schema={CreateLabel.omit({ projectSlug: true })}
      submitText={initialValues ? "Update" : "Create"}
      initialValues={
        initialValues
          ? {
              name: initialValues.name,
              description: initialValues.description || undefined,
              color: initialValues.color,
            }
          : {
              name: "",
              color: randomcolor(),
            }
      }
      updateButton
      onCancel={onCancel}
      onSubmit={async (values) => {
        try {
          if (initialValues) {
            await updateLabelMutation({ ...values, projectSlug: slug, labelId: initialValues.id })
          } else {
            await createLabelMutation({ ...values, projectSlug: slug })
          }
          onSuccess()
        } catch (error) {
          return {
            [FORM_ERROR]:
              "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
          }
        }
      }}
    >
      <Grid item xs={12}>
        <LabelPreview />
      </Grid>
      <LabeledTextField
        name="name"
        label="Name"
        autoComplete="off"
        size="small"
        gridProps={{ sx: 12 as SxProps, md: 4 }}
      />
      <ColorPicker name="color" label="Color" gridProps={{ sx: 12 as SxProps, md: 4 }} />
      <LabeledTextField
        name="description"
        label="Description"
        size="small"
        autoComplete="off"
        gridProps={{ sx: 12 as SxProps, md: 4 }}
      />
    </Form>
  )
}

type LabelItemProps = {
  label: Label
  refetch: () => void
}

const LabelItem: React.FC<LabelItemProps> = ({ label, refetch }) => {
  const { color, description, name, id } = label

  const { slug } = useFeedbackEditor()

  const confirm = useConfirmDialog()

  const [deleteLabelMutation] = useCustomMutation(deleteLabel, {})

  const [editMode, setEditMode] = useState(false)

  const handleEditLabel = () => setEditMode(true)
  const handleCancelEditLabel = () => setEditMode(false)

  const handleDeleteLabel = () =>
    confirm({
      title: `Are you sure you want to delete ${name} label?`,
      onConfirm: async () => {
        await deleteLabelMutation({
          labelId: id,
          projectSlug: slug,
        })
        refetch()
      },
    })

  return (
    <ListItem divider>
      {editMode ? (
        <LabelForm
          onSuccess={() => {
            setEditMode(false)
            refetch()
          }}
          onCancel={handleCancelEditLabel}
          initialValues={label}
        />
      ) : (
        <>
          <ListItemText
            primary={<Chip label={name} sx={{ bgcolor: color }} />}
            secondary={description}
            primaryTypographyProps={{
              component: "div",
            }}
            secondaryTypographyProps={{
              sx: {
                marginTop: 1,
              },
            }}
          />
          <IconButton onClick={handleEditLabel} color="primary" sx={{ marginRight: 1 }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDeleteLabel} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </ListItem>
  )
}

const ManageLabelsDialog: React.FC<ManageLabelsDialogProps> = ({ labels, refetch }) => {
  const { role } = useFeedbackEditor()

  const disableActions = !role || role === ProjectMemberRole.MEMBER

  const [open, setOpen] = useState(false)
  const [openNewLabelForm, setOpenNewLabelForm] = useState(false)

  const handleOpenDialog = () => setOpen(true)
  const handleCloseDialog = () => {
    setOpen(false)
    setOpenNewLabelForm(false)
  }

  const toggleNewLabelForm = () => setOpenNewLabelForm((prevState) => !prevState)

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        size="small"
        endIcon={<LabelsIcon />}
        fullWidth
        disabled={disableActions}
      >
        Manage Labels
      </Button>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Labels Manager</DialogTitle>
        <DialogContent sx={{ padding: 1 }}>
          <Grid container spacing={1}>
            <Grid container item xs={12} justifyContent="flex-end">
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                disableElevation
                size="small"
                onClick={toggleNewLabelForm}
              >
                New Label
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Collapse in={openNewLabelForm} mountOnEnter unmountOnExit>
                <Paper variant="outlined" sx={{ padding: 2, bgcolor: "transparent" }}>
                  <LabelForm
                    onSuccess={() => {
                      toggleNewLabelForm()
                      refetch()
                    }}
                  />
                </Paper>
              </Collapse>
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ padding: 1 }}>
                <Typography variant="h6" component="div">
                  {labels.length} Labels
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <List dense>
                {labels.map((label) => (
                  <LabelItem key={label.id} label={label} refetch={refetch} />
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ManageLabelsDialog
