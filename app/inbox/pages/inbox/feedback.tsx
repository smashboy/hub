import { useState, Suspense, useMemo, forwardRef } from "react"
import { Components, Virtuoso } from "react-virtuoso"
import { BlitzPage, useInfiniteQuery } from "blitz"
import { Grid } from "@mui/material"
import { LoadingButton, Timeline } from "@mui/lab"
import { authConfig } from "app/core/configs/authConfig"
import InboxLayout from "app/inbox/layout/InboxLayout"
import {
  GetNotificationsInput,
  NotificationReadStatus,
} from "app/inbox/queries/getInvitesNotifications"
import NotificationsHeader from "app/inbox/components/NotificationsHeader"
import FeedbackListPlaceholder from "app/project/components/FeedbackListPlaceholder"
import getFeedbackNotifications from "app/inbox/queries/getFeedbackNotifications"
import useNotificationsCounter from "app/inbox/hooks/useNotificationsCounter"
import VirtualListItem from "app/core/components/VirtualListItem"
import NotificationsTimelineWrapper from "app/inbox/components/NotificationsTimelineWrapper"
import NotificationItemWrapper from "app/inbox/components/NotificationItemWrapper"
import FeedbackNotificationItem from "app/inbox/components/FeedbackNotificationItem"

const getInput =
  (selectedStatus: NotificationReadStatus) =>
  (newPage: Partial<GetNotificationsInput> = { take: 10, skip: 0 }) => {
    const page: GetNotificationsInput = {
      ...newPage,
      notificationStatus: selectedStatus,
    }

    return page
  }

const List: React.FC<{ selectedStatus: NotificationReadStatus }> = ({ selectedStatus }) => {
  const { refetch: refetchNotificationsCounter } = useNotificationsCounter()[1]

  const [notificationPages, { isFetchingNextPage, hasNextPage, fetchNextPage, refetch }] =
    useInfiniteQuery(getFeedbackNotifications, getInput(selectedStatus), {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    })

  const notifications = notificationPages.map(({ items }) => items).flat()

  // @ts-ignore TODO fix types
  const Components: Components = useMemo(
    () => ({
      List: forwardRef(({ style, children }, listRef) => (
        // @ts-ignore
        <Timeline style={{ padding: 0, margin: 0, ...style }} ref={listRef}>
          {children}
        </Timeline>
      )),
      item: VirtualListItem,
      Footer: () =>
        hasNextPage ? (
          <LoadingButton
            onClick={() => fetchNextPage()}
            variant="outlined"
            loading={isFetchingNextPage}
            fullWidth
            sx={{ marginTop: 1 }}
          >
            Load More
          </LoadingButton>
        ) : null,
    }),
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )

  return (
    <NotificationsTimelineWrapper>
      <Virtuoso
        data={notifications}
        components={Components}
        style={{ height: "100%" }}
        itemContent={(_, notification) => (
          <NotificationItemWrapper
            key={notification.id}
            id={notification.id}
            createdAt={notification.createdAt}
            isRead={notification.isRead}
            modelKey="feedbackNotification"
            onRefetchCounter={() => {
              refetchNotificationsCounter()
              refetch()
            }}
            isSaved={notification.isSaved}
          >
            <FeedbackNotificationItem notification={notification} />
          </NotificationItemWrapper>
        )}
      />
    </NotificationsTimelineWrapper>
  )
}

const InboxFeedbackPage: BlitzPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<NotificationReadStatus>("all")

  return (
    <Grid container rowSpacing={1}>
      <NotificationsHeader
        selectedStatus={selectedStatus}
        onStatusChange={(newStatus) => setSelectedStatus(newStatus)}
      />
      <Grid item xs={12}>
        <Suspense fallback={<FeedbackListPlaceholder />}>
          <List selectedStatus={selectedStatus} />
        </Suspense>
      </Grid>
    </Grid>
  )
}

InboxFeedbackPage.authenticate = authConfig

InboxFeedbackPage.getLayout = (page) => <InboxLayout title="Invites">{page}</InboxLayout>

export default InboxFeedbackPage
