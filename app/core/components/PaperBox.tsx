import { Box, Grid, Paper, Typography } from "@mui/material"

export const PaperBox: React.FC<{ title: string; dangerZone?: boolean }> = ({
  title,
  children,
  dangerZone,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="div" color="text.primary">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper
          variant="outlined"
          sx={{
            borderColor: dangerZone ? "error.main" : undefined,
            backgroundColor: "transparent",
          }}
        >
          <Box p={2}>{children}</Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default PaperBox
