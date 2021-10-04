import { Routes } from "blitz"
import { Typography, Grid, Fade, Paper, Box, TextField, Button } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import { ButtonRouteLink } from "app/core/components/links"

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
          <Paper sx={{ width: "100%" }}>
            <TextField
              fullWidth
              placeholder="Search projects..."
              size="small"
              onChange={onSearch}
              InputProps={{
                startAdornment: (
                  <Box paddingRight={1} paddingTop={0.5}>
                    <SearchIcon />
                  </Box>
                ),
              }}
            />
          </Paper>
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
