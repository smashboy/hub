import { useRouter, Routes } from "blitz"
import ColorPicker from "app/core/components/ColorPicker"
import Form from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import PaperBox from "app/core/components/PaperBox"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import updateGeneralSettings from "../mutations/updateGeneralSettings"
import { useProject } from "../store/ProjectContext"
import { UpdateProject } from "../validations"

const UpdageProjectGeneralSettingsForm = () => {
  const router = useRouter()

  const {
    project: { slug, name, description, websiteUrl, color },
    updateProject,
  } = useProject()

  const [updateGeneralSettingsMutation] = useCustomMutation(updateGeneralSettings, {
    successNotification: "General settings has been updated successfully!",
  })

  return (
    <PaperBox title="General">
      <Form
        schema={UpdateProject.omit({ slug: true })}
        initialValues={{
          name,
          description,
          websiteUrl,
          color,
        }}
        submitText="Update"
        onSubmit={async (values) => {
          const updatedSlug = await updateGeneralSettingsMutation({ ...values, slug })
          updateProject({ ...values, slug: updatedSlug })
          router.push(Routes.SettingsPage({ slug: updatedSlug }), undefined, { shallow: true })
        }}
        resetOnSuccess
        updateButton
      >
        <LabeledTextField label="Project name" name="name" size="small" />
        <LabeledTextField label="Website url" name="websiteUrl" size="small" />
        <ColorPicker label="Brand color" name="color" />
        <LabeledTextField
          label="Description"
          name="description"
          helperText="A short description of your project so that users can understand what it is about."
          multiline
          rows={4}
        />
      </Form>
    </PaperBox>
  )
}

export default UpdageProjectGeneralSettingsForm
