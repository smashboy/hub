import { Grid, ButtonGroup, Button } from "@mui/material"
import { NotificationReadStatus } from "../queries/getInvitesNotifications"

const NotificationsHeader: React.FC<{
  selectedStatus: NotificationReadStatus
  onStatusChange: (newStatus: NotificationReadStatus) => void
}> = ({ onStatusChange, selectedStatus }) => {
  return (
    <Grid item xs={12}>
      <ButtonGroup color="secondary">
        <Button
          onClick={() => onStatusChange("all")}
          variant={selectedStatus === "all" ? "contained" : "outlined"}
        >
          All
        </Button>
        <Button
          onClick={() => onStatusChange("unread")}
          variant={selectedStatus === "unread" ? "contained" : "outlined"}
        >
          Unread
        </Button>
        <Button
          onClick={() => onStatusChange("read")}
          variant={selectedStatus === "read" ? "contained" : "outlined"}
        >
          Read
        </Button>
      </ButtonGroup>
    </Grid>
  )
}

export default NotificationsHeader
