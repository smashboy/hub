import { Box, Grid, Paper, Typography, PaperProps } from "@mui/material"

export const PaperBox: React.FC<
  { title: string; dangerZone?: boolean } & Omit<PaperProps, "variant">
> = ({ title, children, dangerZone, sx, ...otherProps }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="div" color="text.primary">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper
          {...otherProps}
          variant="outlined"
          sx={{
            ...sx,
            borderColor: dangerZone ? "error.main" : undefined,
            backgroundColor: "transparent",
          }}
        >
          <Box p={2} height="100%">
            {children}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default PaperBox
