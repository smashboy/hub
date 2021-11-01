import { Routes } from "blitz"
import { Grid, Tabs, Tab, Paper, Fade } from "@mui/material"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import { LayoutProps } from "app/core/layouts/Layout"
import { ProjectPageProps } from "../helpers"
import ProjectMiniLayout from "./ProjectMiniLayout"
import { TabRouteLink } from "app/core/components/links"

type ProjectSettingsLayoutProps = {
  selectedTab: "general" | "features" | "members"
}

const ProjectSettingsLayout: React.FC<LayoutProps & ProjectPageProps & ProjectSettingsLayoutProps> =
  ({ children, selectedTab, ...otherProps }) => {
    const {
      project: { slug },
    } = otherProps

    const isSM = useIsSmallDevice()

    return (
      <ProjectMiniLayout {...otherProps}>
        <Grid container spacing={2} sx={{ marginTop: 0.5 }}>
          <Fade in timeout={500}>
            <Grid item xs={12} md={3}>
              <Paper variant="outlined" sx={{ bgcolor: "transparent" }}>
                <Tabs
                  value={selectedTab}
                  orientation={isSM ? "horizontal" : "vertical"}
                  scrollButtons="auto"
                  variant="scrollable"
                >
                  <TabRouteLink
                    href={Routes.SettingsPage({ slug })}
                    value="general"
                    label="General"
                  />
                  {/* <Tab value="features" label="Features" /> */}
                  <TabRouteLink
                    href={Routes.MembersSettingPage({ slug })}
                    value="members"
                    label="Members"
                  />
                  {/* <Tab value="roles" label="Roles" /> */}
                </Tabs>
              </Paper>
            </Grid>
          </Fade>
          <Grid item xs={12} md={9}>
            {children}
          </Grid>
        </Grid>
      </ProjectMiniLayout>
    )
  }

export default ProjectSettingsLayout
