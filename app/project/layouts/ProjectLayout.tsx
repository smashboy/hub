import { useMemo } from "react"
import { Routes } from "blitz"
import { Avatar, Typography, Grid, Container, Tabs, Tab } from "@mui/material"
import { ButtonWebLink, ButtonRouteLink } from "app/core/components/links"
import Layout, { LayoutProps } from "app/core/layouts/Layout"
import OpenIcon from "@mui/icons-material/OpenInNew"
import EditIcon from "@mui/icons-material/Edit"
import { ProjectPageProps } from "../common"

type ProjectLayoutProps = {
  selectedTab: "landing" | "changelog" | "roadmap" | "jobs"
}

const ProjectLayout: React.FC<LayoutProps & ProjectPageProps & ProjectLayoutProps> = ({
  title,
  children,
  selectedTab,
  project: { name, description, logoUrl, websiteUrl, color },
}) => {
  const websiteHost = useMemo(() => (websiteUrl ? new URL(websiteUrl).host : null), [websiteUrl])

  return (
    <Layout title={title}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Container maxWidth="md">
            <Grid container>
              <Grid container item xs={2} justifyContent="flex-end">
                <Avatar
                  src="broken"
                  alt={name}
                  sx={{ bgcolor: color, width: 75, height: 75, fontSize: 32, marginRight: 3 }}
                />
              </Grid>
              <Grid container item xs={10} alignItems="flex-start">
                <Grid item xs={12}>
                  <Typography variant="h4" color="text.primary">
                    {name}
                  </Typography>
                </Grid>
                {description && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {description}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Grid container item xs={12} spacing={1} sx={{ marginTop: 2 }}>
                {websiteHost && websiteUrl && (
                  <Grid item xs={2}>
                    <ButtonWebLink
                      href={websiteUrl}
                      variant="contained"
                      color="inherit"
                      size="small"
                      endIcon={<OpenIcon />}
                      fullWidth
                    >
                      {websiteHost}
                    </ButtonWebLink>
                  </Grid>
                )}
                <Grid item xs={3}>
                  <ButtonRouteLink
                    href="/"
                    variant="contained"
                    size="small"
                    endIcon={<EditIcon />}
                    fullWidth
                  >
                    Create Request
                  </ButtonRouteLink>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={12}>
          <Tabs value={selectedTab} centered>
            <Tab value="landing" label="Home" />
            <Tab value="changelog" label="Changelog" />
            <Tab value="roadmap" label="Roadmap" />
            <Tab value="jobs" label="Jobs" />
          </Tabs>
        </Grid>
      </Grid>
      {children}
    </Layout>
  )
}

export default ProjectLayout
