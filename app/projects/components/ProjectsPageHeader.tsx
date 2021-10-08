import { Routes } from "blitz"
import { Typography, Grid, Fade } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { ButtonRouteLink } from "app/core/components/links"
import SearchField from "app/core/components/SearchField"

const ProjectsPageHeader: React.FC<{
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ onSearch }) => {
  return (
    <Grid item container xs={12} spacing={4}>
      <Grid item xs={12}>
        <Fade in timeout={500}>
          <Typography variant="h4" color="text.primary" align="center">
            Your Projects
          </Typography>
        </Fade>
      </Grid>
      <Grid
        container
        item
        xs={12}
        spacing={1}
        sx={{
          justifyContent: {
            md: "flex-end",
          },
        }}
      >
        <Grid container item xs={12} justifyContent="center">
          <SearchField onChange={onSearch} placeholder="Search projects..." />
        </Grid>
        <Grid item xs={12} md={3}>
          <ButtonRouteLink
            href={Routes.NewProjectPage()}
            variant="contained"
            color="primary"
            fullWidth
            endIcon={<AddIcon />}
          >
            Create Project
          </ButtonRouteLink>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProjectsPageHeader
