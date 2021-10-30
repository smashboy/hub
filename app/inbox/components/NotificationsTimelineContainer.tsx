import { forwardRef } from "react"
import { Timeline } from "@mui/lab"

type NotificationsTimelineContainerProps = {
  style: React.CSSProperties | undefined
}

const NotificationsTimelineContainer = forwardRef<
  NotificationsTimelineContainerProps,
  HTMLDivElement
>(({ children, style }, ref) => {
  return (
    // @ts-ignore
    <Timeline sx={{ paddingX: 0, margin: 0, height: "100%" }} style={style} ref={ref}>
      {children}
    </Timeline>
  )
})

export default NotificationsTimelineContainer
