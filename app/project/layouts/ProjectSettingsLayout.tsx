import { Grid, Tabs, Tab, Paper } from "@mui/material"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import { LayoutProps } from "app/core/layouts/Layout"
import { ProjectPageProps } from "../common"
import ProjectMiniLayout from "./ProjectMiniLayout"

const ProjectSettingsLayout: React.FC<LayoutProps & ProjectPageProps> = ({
  children,
  ...otherProps
}) => {
  const isSM = useIsSmallDevice()

  return (
    <ProjectMiniLayout {...otherProps}>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ bgcolor: "transparent" }}>
            <Tabs
              value="general"
              orientation={isSM ? "horizontal" : "vertical"}
              scrollButtons="auto"
              variant="scrollable"
            >
              <Tab value="general" label="General" />
              <Tab value="features" label="Features" />
              <Tab value="members" label="Members" />
              <Tab value="roles" label="Roles" />
            </Tabs>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          {children}
        </Grid>
      </Grid>
    </ProjectMiniLayout>
  )
}

export default ProjectSettingsLayout
