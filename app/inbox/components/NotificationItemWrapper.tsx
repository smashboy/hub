import { format } from "date-fns"
import { Grid, Typography, Fade, IconButton } from "@mui/material"
import AddSavedIcon from "@mui/icons-material/BookmarkAdd"
import SavedIcon from "@mui/icons-material/BookmarkAdded"
import MarkAsReadIcon from "@mui/icons-material/Check"
import {
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
  TimelineContent,
  TimelineDot,
} from "@mui/lab"
import useNotificationsManager, {
  NotificationsPrismaModelKey,
} from "../hooks/useNotificationsManager"

type NotificationItemWrapperProps = {
  id: number
  createdAt: Date
  isRead: boolean
  isSaved: boolean
  modelKey: NotificationsPrismaModelKey
  children: React.ReactNode
  onRefetchCounter: () => void
}

const NotificationItemWrapper: React.FC<NotificationItemWrapperProps> = ({
  id,
  createdAt,
  children,
  isRead,
  isSaved,
  modelKey,
  onRefetchCounter,
}) => {
  const { markAsRead, updateSavedStatus } = useNotificationsManager()

  const handleMarkAsRead = async () => {
    await markAsRead(id, modelKey)
    onRefetchCounter()
  }

  const handleUpdateSavedStatus = async () => {
    await updateSavedStatus(id, modelKey, !isSaved)
    onRefetchCounter()
  }

  return (
    <Fade in timeout={500}>
      <TimelineItem
        sx={{
          paddingX: {
            xs: 1,
            md: 2,
          },

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
        <TimelineContent sx={{ paddingBottom: 0, paddingLeft: 2, paddingTop: 1, paddingRight: 0 }}>
          <Grid container rowSpacing={1}>
            <Grid item xs={12}>
              {children}
            </Grid>
            <Grid item xs={6} sx={{ paddingLeft: 0.5 }}>
              <Typography color="text.secondary" variant="overline">
                {format(createdAt, "dd MMMM, yyyy")}
              </Typography>
            </Grid>
            <Grid container item xs={6} justifyContent="flex-end">
              <IconButton onClick={handleMarkAsRead} size="small" disabled={isRead}>
                <MarkAsReadIcon
                  fontSize="small"
                  color={isRead ? "success" : undefined}
                  sx={{ opacity: isRead ? 0.45 : 1 }}
                />
              </IconButton>
              <IconButton onClick={handleUpdateSavedStatus} size="small">
                {isSaved ? <SavedIcon /> : <AddSavedIcon fontSize="small" />}
              </IconButton>
            </Grid>
          </Grid>
        </TimelineContent>
      </TimelineItem>
    </Fade>
  )
}

export default NotificationItemWrapper
