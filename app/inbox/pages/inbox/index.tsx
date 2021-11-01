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
import getAllNotifications, {
  GetAllNotificationsInput,
} from "app/inbox/queries/getAllNotifications"
import { NotificationsPrismaModelKey } from "app/inbox/hooks/useNotificationsManager"
import NotificationSelector from "app/inbox/components/NotificationSelector"
import { Timeline } from "@mui/lab"

const getInput =
  (selectedStatus: NotificationReadStatus, savedOnly?: true) =>
  (
    nextPages: Array<{ take: number; skip: number } | null> | undefined
  ): GetAllNotificationsInput => {
    let page: GetNotificationsInput = {
      savedOnly,
      notificationStatus: selectedStatus,
    }

    if (!nextPages) {
      const pagination = { take: 3, skip: 0 }
      page = { ...page, ...pagination }
      return {
        changelogInput: page,
        feedbackInput: page,
        invitesInput: page,
      }
    }

    const next = nextPages.map((next) => next ?? { take: 0, skip: 0 })

    return {
      changelogInput: { ...page, ...next[0] },
      feedbackInput: { ...page, ...next[2] },
      invitesInput: { ...page, ...next[1] },
    }
  }

export const AllNoficationsList: React.FC<{
  selectedStatus: NotificationReadStatus
  savedOnly?: boolean
}> = ({ selectedStatus, savedOnly }) => {
  const { refetch: refetchNotificationsCounter } = useNotificationsCounter()[1]

  const [pages, { hasNextPage, isFetchingNextPage, fetchNextPage, refetch }] = useInfiniteQuery(
    getAllNotifications,
    getInput(selectedStatus, savedOnly),
    {
      getNextPageParam: (lastPage) => {
        const nextPages = Object.values(lastPage).map((page) => page.nextPage)
        // @ts-ignore
        const hasMorePages = nextPages.filter((nextPage) => nextPage?.take > 0 || false).length > 0
        if (hasMorePages) return nextPages
        return null
      },
      refetchOnWindowFocus: false,
    }
  )

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

  const notifications = pages
    .map((page) =>
      Object.entries(page).map(([key, content]) =>
        content.items.map((item) => ({
          notification: item,
          key: key.replace("s", "") as NotificationsPrismaModelKey,
        }))
      )
    )
    .flat(3)

  return (
    <NotificationsTimelineWrapper>
      <Virtuoso
        data={notifications}
        components={Components}
        style={{ height: "100%" }}
        itemContent={(_, { key, notification }) => (
          <NotificationItemWrapper
            key={notification.id}
            id={notification.id}
            createdAt={notification.createdAt}
            isRead={notification.isRead}
            modelKey={key}
            onRefetchCounter={() => {
              refetchNotificationsCounter()
              refetch()
            }}
            isSaved={notification.isSaved}
          >
            <NotificationSelector modelKey={key} props={notification} />
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
