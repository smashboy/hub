import { BlitzPage, GetServerSideProps, getSession, useRouter, Routes } from "blitz"
import { Typography, Grid, Fade, Container } from "@mui/material"
import { getProjectInfo, ProjectPageProps } from "app/project/helpers"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import LabeledTextField from "app/core/components/LabeledTextField"
import { CreateRoadmap } from "app/project/validations"
import Form, { FORM_ERROR } from "app/core/components/Form"
import LabeledDatePicker from "app/core/components/LabeledDatePicker"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import createProjectRoadmap from "app/project/mutations/createProjectRoadmap"
import { useProject } from "app/project/store/ProjectContext"

const NewRoadmapPage: BlitzPage = () => {
  const {
    project: { slug },
  } = useProject()

  const router = useRouter()

  const [createProjectRoadmapMutation] = useCustomMutation(createProjectRoadmap, {
    successNotification: "New roadmap has been created successfully!",
  })

  return (
    <Grid container spacing={2} sx={{ marginTop: 3 }}>
      <Grid item xs={12}>
        <Fade in timeout={500}>
          <Typography variant="h4" color="text.primary" align="center">
            Create New Roadmap
          </Typography>
        </Fade>
      </Grid>
      <Grid container item xs={12} justifyContent="center">
        <Fade in timeout={750}>
          <Typography variant="overline" color="text.secondary" align="center">
            Let other people know what you are working on
          </Typography>
        </Fade>
      </Grid>
      <Grid item xs={12}>
        <Fade in timeout={900}>
          <Container maxWidth="md" disableGutters>
            <Form
              submitText="Create"
              schema={CreateRoadmap.omit({ projectSlug: true })}
              initialValues={{
                name: "",
                description: null,
                dueTo: null,
              }}
              onSubmit={async (roadmap) => {
                try {
                  await createProjectRoadmapMutation({ ...roadmap, projectSlug: slug })
                  router.push(Routes.RoadmapsPage({ slug }))
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
              <LabeledTextField
                label="Description"
                name="description"
                size="small"
                multiline
                rows={4}
              />
            </Form>
          </Container>
        </Fade>
      </Grid>
    </Grid>
  )
}

NewRoadmapPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectMiniLayout title={`New roadmap ${props.project.name}`} {...props}>
    {page}
  </ProjectMiniLayout>
)

export const getServerSideProps: GetServerSideProps<ProjectPageProps> = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession(req, res)
  const slug = (params?.slug as string) || null

  const props = await getProjectInfo(slug, session)

  if (!props)
    return {
      notFound: true,
    }

  return {
    props,
  }
}

export default NewRoadmapPage
