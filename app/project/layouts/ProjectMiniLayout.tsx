import { Avatar, Typography, Grid, Container, Fade } from "@mui/material"
import Layout, { LayoutProps } from "app/core/layouts/Layout"
import { ProjectPageProps } from "../common"

const ProjectMiniLayout: React.FC<LayoutProps & ProjectPageProps> = ({
  title,
  children,
  project: { name, logoUrl, color, slug },
}) => {
  return (
    <Layout title={title}>
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item xs={12}>
          <Container maxWidth="md">
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

export default ProjectMiniLayout
