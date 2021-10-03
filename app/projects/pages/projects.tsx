import { useState, Suspense } from "react"
import { BlitzPage } from "blitz"
import { Typography, Grid, Fade, Tabs, Tab, Container } from "@mui/material"
import Layout from "app/core/layouts/Layout"
import ProjectsList from "../components/ProjectsList"
import ProjectsListPlaceholder from "../components/ProjectsListPlaceholder"
import { authConfig } from "app/core/configs/authConfig"

const ProjectsPage: BlitzPage = () => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => setValue(newValue)

  return (
    <Grid container spacing={2} sx={{ marginTop: 3 }}>
      <Grid item xs={12}>
        <Fade in timeout={500}>
          <Typography variant="h4" color="text.primary" align="center">
            Your Projects
          </Typography>
        </Fade>
      </Grid>
      <Grid item xs={12}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Following" />
          <Tab label="Created" />
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        <Container maxWidth="md">
          <Suspense fallback={<ProjectsListPlaceholder />}>
            <ProjectsList userCreated={!Boolean(value)} />
          </Suspense>
        </Container>
      </Grid>
    </Grid>
  )
}

ProjectsPage.authenticate = authConfig
ProjectsPage.getLayout = (page) => <Layout title="Projects">{page}</Layout>

export default ProjectsPage
