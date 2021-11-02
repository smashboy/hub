import { useState, Suspense, useMemo, forwardRef } from "react"
import { Components, Virtuoso } from "react-virtuoso"
import { BlitzPage, useInfiniteQuery } from "blitz"
import { Grid } from "@mui/material"
import { LoadingButton, Timeline } from "@mui/lab"
import { authConfig } from "app/core/configs/authConfig"
import InboxLayout from "app/inbox/layout/InboxLayout"
import ProjectInviteItem from "app/inbox/components/ProjectInviteItem"
import NotificationItemWrapper from "app/inbox/components/NotificationItemWrapper"
import NotificationsHeader from "app/inbox/components/NotificationsHeader"
import useNotificationsCounter from "app/inbox/hooks/useNotificationsCounter"
import getInvitesNotifications, {
  GetNotificationsInput,
  NotificationReadStatus,
} from "app/inbox/queries/getInvitesNotifications"
import VirtualListItem from "app/core/components/VirtualListItem"
import FeedbackListPlaceholder from "app/project/components/FeedbackListPlaceholder"
import NotificationsTimelineWrapper from "app/inbox/components/NotificationsTimelineWrapper"

// type InboxInvitesPageProps = {
//   invites: Array<{
//     id: number
//     createdAt: Date
//     isRead: boolean
//     isSaved: boolean
//     project: {
//       name: string
//       slug: string
//       isPrivate: boolean
//       description: string | null
//       logoUrl: string | null
//     }
//   }>
// }

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

  const [invitesPages, { isFetchingNextPage, hasNextPage, fetchNextPage, refetch }] =
    useInfiniteQuery(getInvitesNotifications, getInput(selectedStatus), {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    })

  const invites = invitesPages.map(({ items }) => items).flat()

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
        data={invites}
        components={Components}
        style={{ height: "100%" }}
        itemContent={(_, { id, createdAt, isRead, isSaved, projectInvite }) => (
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
            <ProjectInviteItem invite={projectInvite!} onActionDone={() => refetch()} />
          </NotificationItemWrapper>
        )}
      />
    </NotificationsTimelineWrapper>
  )
}

const InboxInvitesPage: BlitzPage = () => {
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

InboxInvitesPage.authenticate = authConfig

InboxInvitesPage.getLayout = (page) => <InboxLayout title="Invites">{page}</InboxLayout>

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const session = await getSession(req, res)
//   const authUserId = session.userId!

//   const invites = await db.projectInvite.findMany({
//     where: {
//       notifications: {
//         user: {
//           id: authUserId,
//         },
//       },
//     },
//     select: {
//       id: true,
//       createdAt: true,
//       isRead: true,
//       isSaved: true,
//       project: {
//         select: {
//           name: true,
//           slug: true,
//           isPrivate: true,
//           description: true,
//           logoUrl: true,
//         },
//       },
//     },
//   })

//   return {
//     props: {
//       invites,
//     },
//   }
// }

export default InboxInvitesPage
