import { ProjectMemberRole } from "db"
import { BlitzPage, getSession, GetServerSideProps, useRouter, Routes } from "blitz"
import { Grid, Typography, Button, Fade, Box, styled, Avatar } from "@mui/material"
import PaperBox from "app/core/components/PaperBox"
// import SwitchField from "app/core/components/SwitchField"
import { authConfig } from "app/core/configs/authConfig"
import { getProjectInfo, ProjectPageProps } from "app/project/helpers"
import ProjectSettingsLayout from "app/project/layouts/ProjectSettingsLayout"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import updateGeneralSettings from "app/project/mutations/updateGeneralSettings"
// import updateIsPrivateSetting from "app/project/mutations/updateIsPrivateSetting"
import deleteProject from "app/project/mutations/deleteProject"
import { useConfirmDialog } from "react-mui-confirm"
import UpdageProjectGeneralSettingsForm from "app/project/components/UpdageProjectGeneralSettingsForm"

const BoldText = styled("b")(({ theme }) => ({
  color: theme.palette.primary.main,
}))

const SettingsPage: BlitzPage<ProjectPageProps> = ({
  project: { name, description, websiteUrl, color, slug, logoUrl, role },
}: ProjectPageProps) => {
  const router = useRouter()

  const confirm = useConfirmDialog()

  const [deleteProjectMutation] = useCustomMutation(deleteProject, {
    successNotification: "Project has been deleted successfully!",
  })

  const handleDeleteProject = () => {
    confirm({
      title: `Are you shure you want to delete ${name}?`,
      confirmText: name,
      description: (
        <Box sx={{ paddingBottom: 3 }}>
          This action cannot be undone. This will permanently delete the <BoldText>{name}</BoldText>
          . <br />
          <br /> Please type <BoldText>{name}</BoldText> to confirm.
        </Box>
      ),
      onConfirm: async () => {
        await deleteProjectMutation({
          projectSlug: slug,
        })
        router.push(Routes.ProjectsPage())
      },
    })
  }

  // const [updateIsPrivateSettingMutation] = useCustomMutation(updateIsPrivateSetting, {
  //   successNotification: "Privacy visibility setting has been updated successfully!",
  // })

  return (
    <>
      <Grid container spacing={2}>
        <Fade in timeout={350}>
          <Grid item xs={12}>
            <PaperBox title="Logo">
              <Avatar
                src={logoUrl ?? "broken"}
                alt={name}
                sx={{ bgcolor: color, width: 75, height: 75, fontSize: 32, cursor: "pointer" }}
              />
            </PaperBox>
          </Grid>
        </Fade>
        <Fade in timeout={500}>
          <Grid item xs={12}>
            <UpdageProjectGeneralSettingsForm />
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
                    <Button
                      onClick={handleDeleteProject}
                      variant="outlined"
                      color="secondary"
                      disabled={role !== ProjectMemberRole.FOUNDER}
                      fullWidth
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </PaperBox>
          </Grid>
        </Fade>
      </Grid>
    </>
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
