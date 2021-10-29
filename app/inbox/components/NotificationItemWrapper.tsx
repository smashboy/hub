import { format } from "date-fns"
import { Grid, Typography, Fade } from "@mui/material"
import {
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
  TimelineContent,
  TimelineDot,
} from "@mui/lab"

type NotificationItemWrapperProps = {
  id: number
  createdAt: Date
  children: React.ReactNode
}

const NotificationItemWrapper: React.FC<NotificationItemWrapperProps> = ({
  id,
  createdAt,
  children,
}) => {
  return (
    <Fade in timeout={500}>
      <TimelineItem
        sx={{
          "&:before": {
            flex: "none!important",
            padding: 0,
          },
        }}
      >
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: 0, px: 2 }}>
          <Grid container>
            <Grid item xs={12}>
              {children}
            </Grid>
            <Grid item xs={12} sx={{ paddingLeft: 0.5 }}>
              <Typography color="text.secondary" variant="overline">
                {format(createdAt, "dd MMMM, yyyy")}
              </Typography>
            </Grid>
          </Grid>
        </TimelineContent>
      </TimelineItem>
    </Fade>
  )
}

export default NotificationItemWrapper
