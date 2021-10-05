import { useMemo } from "react"
import { Routes } from "blitz"
import { Avatar, Typography, Grid, Container, Tabs, Tab, Fade } from "@mui/material"
import { ButtonWebLink, ButtonRouteLink } from "app/core/components/links"
import Layout, { LayoutProps } from "app/core/layouts/Layout"
import OpenIcon from "@mui/icons-material/OpenInNew"
import EditIcon from "@mui/icons-material/Edit"
import { ProjectPageProps } from "../common"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"

type ProjectLayoutProps = {
  selectedTab: "landing" | "changelog" | "roadmap" | "jobs" | "feedback"
}

const ProjectLayout: React.FC<LayoutProps & ProjectPageProps & ProjectLayoutProps> = ({
  title,
  children,
  selectedTab,
  project: { name, description, logoUrl, websiteUrl, color, slug },
}) => {
  const isSM = useIsSmallDevice()

  const user = useCurrentUser({
    options: {
      suspense: false,
    },
  })

  const websiteHost = useMemo(() => (websiteUrl ? new URL(websiteUrl).host : null), [websiteUrl])

  return (
    <Layout title={title}>
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item xs={12}>
          <Container maxWidth="md">
            <Grid container>
              <Fade in timeout={350}>
                <Grid container>
                  <Grid container item xs={3} md={2} justifyContent="flex-end">
                    <Avatar
                      src="broken"
                      alt={name}
                      sx={{ bgcolor: color, width: 75, height: 75, fontSize: 32, marginRight: 3 }}
                    />
                  </Grid>
                  <Grid container item xs={9} md={10} alignItems="flex-start">
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
                </Grid>
              </Fade>
              <Fade in timeout={500}>
                <Grid container item xs={12} spacing={1} sx={{ marginTop: 2 }}>
                  {websiteHost && websiteUrl && (
                    <Grid item xs={12} md={2}>
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
                  <Grid item xs={12} md={3}>
                    <ButtonRouteLink
                      href={Routes.FeedbackPage({ slug })}
                      variant="contained"
                      size="small"
                      endIcon={<EditIcon />}
                      fullWidth
                    >
                      Give feedback
                    </ButtonRouteLink>
                  </Grid>
                </Grid>
              </Fade>
            </Grid>
          </Container>
        </Grid>
        <Fade in timeout={750}>
          <Grid item xs={12}>
            <Tabs
              value={selectedTab}
              variant={isSM ? "scrollable" : "standard"}
              scrollButtons="auto"
              centered={!isSM}
            >
              <Tab value="landing" label="Home" />
              <Tab value="changelog" label="Changelog" />
              <Tab value="feedback" label="Feedback" disabled={!Boolean(user)} />
              <Tab value="roadmap" label="Roadmap" />
              <Tab value="jobs" label="Jobs" />
            </Tabs>
          </Grid>
        </Fade>
      </Grid>
      {children}
    </Layout>
  )
}

export default ProjectLayout
