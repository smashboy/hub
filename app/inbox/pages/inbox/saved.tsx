import { useState, Suspense } from "react"
import { BlitzPage } from "blitz"
import { Grid } from "@mui/material"
import { authConfig } from "app/core/configs/authConfig"
import InboxLayout from "app/inbox/layout/InboxLayout"
import { NotificationReadStatus } from "app/inbox/queries/getInvitesNotifications"
import NotificationsHeader from "app/inbox/components/NotificationsHeader"
import FeedbackListPlaceholder from "app/project/components/FeedbackListPlaceholder"
import { AllNoficationsList } from "./index"

const InboxSaved: BlitzPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<NotificationReadStatus>("all")

  return (
    <Grid container rowSpacing={1}>
      <NotificationsHeader
        selectedStatus={selectedStatus}
        onStatusChange={(newStatus) => setSelectedStatus(newStatus)}
      />
      <Grid item xs={12}>
        <Suspense fallback={<FeedbackListPlaceholder />}>
          <AllNoficationsList selectedStatus={selectedStatus} savedOnly />
        </Suspense>
      </Grid>
    </Grid>
  )
}

InboxSaved.authenticate = authConfig

InboxSaved.getLayout = (page) => <InboxLayout title="Inbox">{page}</InboxLayout>

export default InboxSaved
