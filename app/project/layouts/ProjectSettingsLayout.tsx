import { Routes, useMutation, useRouter } from "blitz"
import { Grid, Tabs, Tab, Paper, Fade } from "@mui/material"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import { LayoutProps } from "app/core/layouts/Layout"
import { ProjectPageProps } from "../helpers"
import ProjectMiniLayout from "./ProjectMiniLayout"

type ProjectSettingsLayoutProps = {
  selectedTab: "general" | "features" | "members"
}

const ProjectSettingsLayout: React.FC<LayoutProps & ProjectPageProps & ProjectSettingsLayoutProps> =
  ({ children, selectedTab, ...otherProps }) => {
    const router = useRouter()

    const {
      project: { slug },
    } = otherProps

    const isSM = useIsSmallDevice()

    return (
      <ProjectMiniLayout {...otherProps}>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Fade in timeout={500}>
            <Grid item xs={12} md={3}>
              <Paper variant="outlined" sx={{ bgcolor: "transparent" }}>
                <Tabs
                  value={selectedTab}
                  orientation={isSM ? "horizontal" : "vertical"}
                  scrollButtons="auto"
                  variant="scrollable"
                >
                  <Tab
                    value="general"
                    label="General"
                    onClick={(event) => {
                      event.preventDefault()
                      router.push(Routes.SettingsPage({ slug }))
                    }}
                  />
                  <Tab value="features" label="Features" />
                  <Tab
                    value="members"
                    label="Members"
                    onClick={(event) => {
                      event.preventDefault()
                      router.push(Routes.MembersSettingPage({ slug }))
                    }}
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
