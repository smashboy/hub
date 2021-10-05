import { BlitzPage, useRouter, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Typography, Grid, Fade, useTheme, Container } from "@mui/material"
import Form, { FORM_ERROR } from "app/core/components/Form"
import { CreateProject } from "../validations"
import LabeledTextField from "app/core/components/LabeledTextField"
import ColorPicker from "app/core/components/ColorPicker"
import SwitchField from "app/core/components/SwitchField"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import createProject from "../mutations/createProject"
import { authConfig } from "app/core/configs/authConfig"

const NewProjectPage: BlitzPage = () => {
  const router = useRouter()
  const theme = useTheme()

  const [createProjectMutation] = useCustomMutation(createProject, {
    successNotification: "New project has been created successfully!",
    disableErrorNotification: true,
  })

  return (
    <Grid container spacing={2} sx={{ marginTop: 6 }}>
      <Grid item xs={12}>
        <Fade in timeout={500}>
          <Typography variant="h4" color="text.primary" align="center">
            Create New Project
          </Typography>
        </Fade>
      </Grid>
      <Grid container item xs={12} justifyContent="center">
        <Fade in timeout={750}>
          <Typography variant="overline" color="text.secondary" align="center">
            Tell us about you project
          </Typography>
        </Fade>
      </Grid>
      <Grid item xs={12}>
        <Fade in timeout={900}>
          <Container maxWidth="md" disableGutters>
            <Form
              submitText="Create"
              schema={CreateProject}
              initialValues={{
                name: "",
                color: theme.palette.primary.main,
                isPrivate: false,
                description: null,
                websiteUrl: null,
              }}
              onSubmit={async (project) => {
                try {
                  await createProjectMutation(project)
                  router.push(Routes.ProjectsPage())
                } catch (error) {
                  if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
                    return { name: "This project name is already being used" }
                  } else {
                    return { [FORM_ERROR]: error.toString() }
                  }
                }
              }}
            >
              <LabeledTextField label="Project name *" name="name" size="small" />
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
              <SwitchField
                label="Private project"
                name="isPrivate"
                helperMessage="Will this project be publicly available."
              />
            </Form>
          </Container>
        </Fade>
      </Grid>
    </Grid>
  )
}

NewProjectPage.authenticate = authConfig
NewProjectPage.getLayout = (page) => <Layout title="Projects">{page}</Layout>

export default NewProjectPage
