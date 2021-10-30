import db from "db"
import { useState } from "react"
import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Grid } from "@mui/material"
import { Timeline } from "@mui/lab"
import { authConfig } from "app/core/configs/authConfig"
import InboxLayout from "app/inbox/layout/InboxLayout"
import ProjectInviteItem from "app/inbox/components/ProjectInviteItem"
import NotificationItemWrapper from "app/inbox/components/NotificationItemWrapper"
import NotificationsHeader from "app/inbox/components/NotificationsHeader"
import useNotificationsCounter from "app/inbox/hooks/useNotificationsCounter"

type InboxInvitesPageProps = {
  invites: Array<{
    id: number
    createdAt: Date
    isRead: boolean
    isSaved: boolean
    project: {
      name: string
      slug: string
      isPrivate: boolean
      description: string | null
      logoUrl: string | null
    }
  }>
}

const InboxInvitesPage: BlitzPage<InboxInvitesPageProps> = (props: InboxInvitesPageProps) => {
  const [invites, setInvites] = useState(props.invites)

  const { refetch } = useNotificationsCounter(false)[1]

  const handleFilterInvites = (id: number) =>
    setInvites(invites.filter((invite) => invite.id !== id))

  return (
    <Grid container rowSpacing={1}>
      <NotificationsHeader />
      <Grid item xs={12}>
        <Timeline sx={{ paddingX: 0, margin: 0 }}>
          {invites.map((invite) => (
            <NotificationItemWrapper
              key={invite.id}
              id={invite.id}
              createdAt={invite.createdAt}
              isRead={invite.isRead}
              modelKey="projectInvite"
              onRefetchCounter={() => refetch()}
              isSaved={invite.isSaved}
            >
              <ProjectInviteItem
                key={invite.id}
                invite={invite}
                onActionDone={handleFilterInvites}
              />
            </NotificationItemWrapper>
          ))}
        </Timeline>
      </Grid>
    </Grid>
  )
}

InboxInvitesPage.authenticate = authConfig

InboxInvitesPage.getLayout = (page) => <InboxLayout title="Invites">{page}</InboxLayout>

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  const authUserId = session.userId!

  const invites = await db.projectInvite.findMany({
    where: {
      notifications: {
        user: {
          id: authUserId,
        },
      },
    },
    select: {
      id: true,
      createdAt: true,
      isRead: true,
      isSaved: true,
      project: {
        select: {
          name: true,
          slug: true,
          isPrivate: true,
          description: true,
          logoUrl: true,
        },
      },
    },
  })

  return {
    props: {
      invites,
    },
  }
}

export default InboxInvitesPage
