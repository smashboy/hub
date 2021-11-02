import { useState, Suspense, useMemo, forwardRef } from "react"
import { Components, Virtuoso } from "react-virtuoso"
import { BlitzPage, useInfiniteQuery } from "blitz"
import { Grid } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { authConfig } from "app/core/configs/authConfig"
import InboxLayout from "app/inbox/layout/InboxLayout"
import {
  GetNotificationsInput,
  NotificationReadStatus,
} from "app/inbox/queries/getInvitesNotifications"
import NotificationsHeader from "app/inbox/components/NotificationsHeader"
import useNotificationsCounter from "app/inbox/hooks/useNotificationsCounter"
import VirtualListItem from "app/core/components/VirtualListItem"
import NotificationsTimelineWrapper from "app/inbox/components/NotificationsTimelineWrapper"
import NotificationItemWrapper from "app/inbox/components/NotificationItemWrapper"
import FeedbackListPlaceholder from "app/project/components/FeedbackListPlaceholder"
import getAllNotifications from "app/inbox/queries/getAllNotifications"
import NotificationSelector from "app/inbox/components/NotificationSelector"
import { Timeline } from "@mui/lab"

const getInput =
  (selectedStatus: NotificationReadStatus, savedOnly?: true) =>
  (newPage: Partial<GetNotificationsInput> = { take: 10, skip: 0 }) => {
    const page: GetNotificationsInput = {
      ...newPage,
      savedOnly,
      notificationStatus: selectedStatus,
    }

    return page
  }

export const AllNoficationsList: React.FC<{
  selectedStatus: NotificationReadStatus
  savedOnly?: true
}> = ({ selectedStatus, savedOnly }) => {
  const { refetch: refetchNotificationsCounter } = useNotificationsCounter()[1]

  const [notificationPages, { hasNextPage, isFetchingNextPage, fetchNextPage, refetch }] =
    useInfiniteQuery(getAllNotifications, getInput(selectedStatus, savedOnly), {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    })

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

  const notifications = notificationPages.map(({ items }) => items).flat()

  return (
    <NotificationsTimelineWrapper>
      <Virtuoso
        data={notifications}
        components={Components}
        style={{ height: "100%" }}
        itemContent={(
          _,
          {
            id,
            createdAt,
            isRead,
            isSaved,
            feedbackNotification,
            newChangelogNotification,
            projectInvite,
          }
        ) => (
          <NotificationItemWrapper
            key={id}
            id={id}
            createdAt={createdAt}
            isRead={isRead}
            onRefetchCounter={() => {
              refetchNotificationsCounter()
              refetch()
            }}
            isSaved={isSaved}
          >
            <NotificationSelector
              notification={{ feedbackNotification, newChangelogNotification, projectInvite }}
              onInviteActionDone={() => {
                refetchNotificationsCounter()
                refetch()
              }}
            />
          </NotificationItemWrapper>
        )}
      />
    </NotificationsTimelineWrapper>
  )
}

const InboxAllPage: BlitzPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<NotificationReadStatus>("all")

  return (
    <Grid container rowSpacing={1}>
      <NotificationsHeader
        selectedStatus={selectedStatus}
        onStatusChange={(newStatus) => setSelectedStatus(newStatus)}
      />
      <Grid item xs={12}>
        <Suspense fallback={<FeedbackListPlaceholder />}>
          <AllNoficationsList selectedStatus={selectedStatus} />
        </Suspense>
      </Grid>
    </Grid>
  )
}

InboxAllPage.authenticate = authConfig

InboxAllPage.getLayout = (page) => <InboxLayout title="Inbox">{page}</InboxLayout>

export default InboxAllPage
