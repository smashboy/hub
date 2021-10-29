import { Grid, ButtonGroup, Button } from "@mui/material"

const NotificationsHeader = () => {
  return (
    <Grid item xs={12}>
      <ButtonGroup variant="outlined" color="secondary">
        <Button variant="contained">All</Button>
        <Button>Unread</Button>
        <Button>Read</Button>
      </ButtonGroup>
    </Grid>
  )
}

export default NotificationsHeader
