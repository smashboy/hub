import { ProjectMemberRole } from "db"
import { BlitzPage, getSession, GetServerSideProps } from "blitz"
import { Grid, Typography, Button, Fade } from "@mui/material"
import ColorPicker from "app/core/components/ColorPicker"
import Form from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import PaperBox from "app/core/components/PaperBox"
// import SwitchField from "app/core/components/SwitchField"
import { authConfig } from "app/core/configs/authConfig"
import { getProjectInfo, ProjectPageProps } from "app/project/helpers"
import ProjectSettingsLayout from "app/project/layouts/ProjectSettingsLayout"
import { UpdateProject } from "app/project/validations"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import updateGeneralSettings from "app/project/mutations/updateGeneralSettings"
import updateIsPrivateSetting from "app/project/mutations/updateIsPrivateSetting"

const SettingsPage: BlitzPage<ProjectPageProps> = ({
  project: { name, description, websiteUrl, color, isPrivate, slug },
}: ProjectPageProps) => {
  const [updateGeneralSettingsMutation] = useCustomMutation(updateGeneralSettings, {
    successNotification: "General settings has been updated successfully!",
  })

  // const [updateIsPrivateSettingMutation] = useCustomMutation(updateIsPrivateSetting, {
  //   successNotification: "Privacy visibility setting has been updated successfully!",
  // })

  return (
    <Grid container spacing={2}>
      <Fade in timeout={500}>
        <Grid item xs={12}>
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
                await updateGeneralSettingsMutation({ ...values, slug })
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
                maxRows={4}
              />
            </Form>
          </PaperBox>
        </Grid>
      </Fade>
      <Fade in timeout={750}>
        <Grid item xs={12}>
          <PaperBox title="Danger Zone" dangerZone>
            <Grid container spacing={2}>
              {/* <Grid item xs={12}>
                <Form
                  schema={UpdateIsProjectPrivateDanger.omit({ slug: true })}
                  submitText="Update"
                  initialValues={{
                    isPrivate,
                  }}
                  onSubmit={async (values) => {
                    await updateIsPrivateSettingMutation({ ...values, slug })
                  }}
                  updateButton
                  resetOnSuccess
                >
                  <SwitchField
                    label="Private project"
                    name="isPrivate"
                    helperMessage="Will this project be publicly available. Changing this option will effect project accessibility for your users."
                  />
                </Form>
              </Grid> */}
              {/* <Grid item xs={12}>
                <Divider />
              </Grid> */}
              <Grid container item xs={12}>
                <Grid container item xs={12} md={9}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Delete this project
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Once you delete a project, there is no going back. Please be certain.
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item xs={12} md={3} alignItems="center">
                  <Button variant="outlined" color="secondary" fullWidth>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </PaperBox>
        </Grid>
      </Fade>
    </Grid>
  )
}

SettingsPage.authenticate = authConfig

SettingsPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectSettingsLayout title={`Settings ${props.project.name}`} {...props} selectedTab="general">
    {page}
  </ProjectSettingsLayout>
)

export const getServerSideProps: GetServerSideProps<ProjectPageProps> = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession(req, res)
  const slug = (params?.slug as string) || null

  const props = await getProjectInfo(slug, session, [
    ProjectMemberRole.ADMIN,
    ProjectMemberRole.FOUNDER,
  ])

  if (!props)
    return {
      notFound: true,
    }

  return {
    props,
  }
}

export default SettingsPage
