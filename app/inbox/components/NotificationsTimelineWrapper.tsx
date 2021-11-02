import { Box } from "@mui/material"
import useIsSmallDevice from "app/core/hooks/useIsSmallDevice"

const NotificationsTimelineWrapper: React.FC = ({ children }) => {
  const isSM = useIsSmallDevice()

  return (
    <Box
      sx={{
        height: isSM ? "calc(100vh - 210px)" : "calc(100vh - 145px)",
        // width: {
        //   sm: "100%",
        //   md: "60%",
        //   margin: "0 auto",
        // },
        // bgcolor: "red"
      }}
    >
      {children}
    </Box>
  )
}

export default NotificationsTimelineWrapper
