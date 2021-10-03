import { Box, Container, Divider, Grid, Typography } from "@mui/material"
import LogoIcon from "@mui/icons-material/DeviceHub"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import Layout, { LayoutProps } from "app/core/layouts/Layout"

const AuthLayout: React.FC<LayoutProps & { pageTitle: string }> = ({
  title,
  children,
  pageTitle,
}) => {
  const isSM = useIsSmallDevice()

  return (
    <Layout title={title} disableContainer disableNavigation>
      <Container maxWidth="sm">
        <Box display="flex" alignItems="center" width="100%" height="90vh" justifyContent="center">
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid container item xs={12} justifyContent="center" alignItems="center">
                  <Box
                    sx={{
                      borderWidth: 5,
                      borderRadius: 50,
                      borderColor: "primary.light",
                      backgroundColor: "primary.dark",
                      borderStyle: "solid",
                      marginBottom: 3,
                      padding: 1,
                    }}
                  >
                    <LogoIcon sx={{ fontSize: 48, marginLeft: 0.5, color: "white" }} />
                  </Box>
                </Grid>
                <Grid container item xs={5} justifyContent="flex-end" alignItems="center">
                  <Typography variant={isSM ? "h5" : "h4"} color="text.primary" component="div">
                    Project Hub
                  </Typography>
                </Grid>
                <Grid container item xs={2} justifyContent="center">
                  <Divider orientation="vertical" />
                </Grid>
                <Grid container item xs={5} justifyContent="flex-start" alignItems="center">
                  <Typography
                    variant="overline"
                    component="div"
                    color="text.primary"
                    sx={{ fontSize: "1.125rem" }}
                  >
                    {pageTitle}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {children}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  )
}

export default AuthLayout
