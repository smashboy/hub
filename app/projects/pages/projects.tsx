import { useState, Suspense } from "react"
import { BlitzPage } from "blitz"
import { Grid, Container } from "@mui/material"
import Layout from "app/core/layouts/Layout"
import ProjectsList from "../components/ProjectsList"
import ProjectsListPlaceholder from "../components/ProjectsListPlaceholder"
import ProjectsPageHeader from "../components/ProjectsPageHeader"
import { authConfig } from "app/core/configs/authConfig"

const ProjectsPage: BlitzPage = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.currentTarget.value)

  return (
    <Container maxWidth="md" disableGutters>
      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        <ProjectsPageHeader onSearch={handleChange} />
        <Grid item xs={12}>
          <Suspense fallback={<ProjectsListPlaceholder />}>
            <ProjectsList searchQuery={searchQuery} />
          </Suspense>
        </Grid>
      </Grid>
    </Container>
  )
}

ProjectsPage.authenticate = authConfig
ProjectsPage.getLayout = (page) => <Layout title="Projects">{page}</Layout>

export default ProjectsPage
