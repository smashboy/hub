import { Box, CircularProgress } from "@mui/material"

export const LoadingAnimation: React.FC<{ padding?: number }> = ({ padding }) => {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      paddingY={padding ?? 10}
    >
      <CircularProgress color="primary" />
    </Box>
  )
}

export default LoadingAnimation
