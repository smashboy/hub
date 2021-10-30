import { Box } from "@mui/material"

const NotificationsTimelineWrapper: React.FC = ({ children }) => (
  <Box
    sx={{
      height: "calc(100vh - 145px)",
      // bgcolor: "red"
    }}
  >
    {children}
  </Box>
)

export default NotificationsTimelineWrapper
