import { useMemo } from "react"
import { Routes } from "blitz"
import { Avatar, Typography, Grid, Container, Fade, Hidden } from "@mui/material"
import { RouteLink } from "app/core/components/links"
import Layout, { LayoutProps } from "app/core/layouts/Layout"
import { ProjectPageProps } from "../helpers"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import { ProjectProvider, useProject } from "../store/ProjectContext"

const ProjectMiniLayoutContent: React.FC<LayoutProps> = ({
  title,
  children,
  disableContainer,
  disableNavigation,
}) => {
  const {
    project: { name, logoUrl, color, slug, description },
  } = useProject()

  console.log(slug)

  const isSM = useIsSmallDevice()

  const avatarSize = useMemo(() => (isSM ? 45 : 75), [isSM])

  return (
    <Layout title={title} disableNavigation={disableNavigation} disableContainer={disableContainer}>
      <Grid container rowSpacing={1} sx={{ marginTop: 1 }}>
        <Grid item xs={12}>
          <Container>
            <Fade in timeout={350}>
              <Grid container>
                <Grid container item xs={2} md={1} alignItems="center">
                  <RouteLink href={Routes.ProjectLandingPage({ slug })}>
                    <Avatar
                      src={logoUrl ?? "broken"}
                      alt={name}
                      sx={{
                        bgcolor: color,
                        width: avatarSize,
                        height: avatarSize,
                        fontSize: 32,
                        marginRight: 3,
                      }}
                    />
                  </RouteLink>
                </Grid>
                <Grid container item xs={10} md={10} alignItems={isSM ? "center" : "flex-start"}>
                  <Grid item xs={12}>
                    <Typography
                      href={Routes.ProjectLandingPage({ slug })}
                      variant={isSM ? "h5" : "h4"}
                      color="text.primary"
                      component={RouteLink}
                    >
                      {name}
                    </Typography>
                  </Grid>
                  {description && (
                    <Hidden smDown>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" color="text.secondary">
                          {description}
                        </Typography>
                      </Grid>
                    </Hidden>
                  )}
                </Grid>
              </Grid>
            </Fade>
          </Container>
        </Grid>
      </Grid>
      {children}
    </Layout>
  )
}

const ProjectMiniLayout: React.FC<LayoutProps & ProjectPageProps> = ({
  children,
  project,
  ...otherProps
}) => {
  return (
    <ProjectProvider initialValues={project}>
      <ProjectMiniLayoutContent {...otherProps}>{children}</ProjectMiniLayoutContent>
    </ProjectProvider>
  )
}

export default ProjectMiniLayout
