import { useRouter, Routes } from "blitz"
import DialogForm from "app/core/components/DialogForm"
import { FORM_ERROR } from "app/core/components/Form"
import LabeledDatePicker from "app/core/components/LabeledDatePicker"
import LabeledTextField from "app/core/components/LabeledTextField"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import updateProjectRoadmap from "../mutations/updateProjectRoadmap"
import { UpdateProjectRoadmap } from "../validations"
import { useProject } from "../store/ProjectContext"

type UpdateRoadmapDialogProps = {
  open: boolean
  onClose: () => void
  roadmap: {
    id: number
    name: string
    description: string | null
    dueTo: Date | null
  }
  onUpdate: (roadmap: { name: string; description: string | null; dueTo: Date | null }) => void
}

const UpdateRoadmapDialog: React.FC<UpdateRoadmapDialogProps> = ({
  open,
  onClose,
  roadmap,
  onUpdate,
}) => {
  const {
    project: { slug: projectSlug },
  } = useProject()

  const { name, id } = roadmap

  const router = useRouter()

  const [updateProjectRoadmapMutation] = useCustomMutation(updateProjectRoadmap, {
    successNotification: "Roadmap info has been updated successfully!",
    disableErrorNotification: true,
  })

  return (
    <DialogForm
      title={`Update ${name} roadmap`}
      open={open}
      onClose={onClose}
      schema={UpdateProjectRoadmap.omit({ roadmapId: true })}
      resetOnSuccess
      initialValues={roadmap}
      submitText="Update"
      DialogProps={{
        maxWidth: "sm",
      }}
      onSubmit={async (roadmap) => {
        try {
          const updatedSlug = await updateProjectRoadmapMutation({ ...roadmap, roadmapId: id })
          router.push(
            Routes.RoadmapPage({ slug: projectSlug, roadmapSlug: updatedSlug }),
            undefined,
            {
              shallow: true,
            }
          )
          onUpdate(roadmap)
        } catch (error) {
          if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
            return { name: "This roadmap name is already being used" }
          } else {
            return { [FORM_ERROR]: error.toString() }
          }
        }
      }}
    >
      <LabeledTextField label="Name *" name="name" size="small" autoComplete="off" />
      <LabeledDatePicker label="Due to" name="dueTo" textFieldProps={{ size: "small" }} />
      <LabeledTextField label="Description" name="description" size="small" multiline rows={4} />
    </DialogForm>
  )
}

export default UpdateRoadmapDialog
