import { ProjectMemberRole } from "db"
import { BlitzPage, getSession, GetServerSideProps } from "blitz"
import { Grid, Divider, Typography, Button } from "@mui/material"
import ColorPicker from "app/core/components/ColorPicker"
import Form from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import PaperBox from "app/core/components/PaperBox"
import SwitchField from "app/core/components/SwitchField"
import { authConfig } from "app/core/configs/authConfig"
import { getProjectInfo, ProjectPageProps } from "app/project/helpers"
import ProjectSettingsLayout from "app/project/layouts/ProjectSettingsLayout"
import { CreateProject } from "app/project/validations"

const SettingsPage: BlitzPage<ProjectPageProps> = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PaperBox title="General">
          <Form
            schema={CreateProject.omit({ isPrivate: true })}
            submitText="Update"
            ButtonProps={{
              size: "medium",
            }}
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
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <PaperBox title="Danger Zone" dangerZone>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Form
                schema={CreateProject.omit({ isPrivate: true })}
                submitText="Update"
                ButtonProps={{
                  size: "medium",
                }}
                updateButton
              >
                <SwitchField
                  label="Private project"
                  name="isPrivate"
                  helperMessage="Will this project be publicly available. Changing this option will effect project accessibility for your users."
                />
              </Form>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
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
                <Button variant="outlined" color="inherit" fullWidth>
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </PaperBox>
      </Grid>
    </Grid>
  )
}

SettingsPage.authenticate = authConfig

SettingsPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectSettingsLayout title={`${props.project.name} Settings`} {...props}>
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
