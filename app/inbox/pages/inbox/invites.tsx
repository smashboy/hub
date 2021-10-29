import db from "db"
import { useState } from "react"
import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Grid } from "@mui/material"
import { Timeline } from "@mui/lab"
import { authConfig } from "app/core/configs/authConfig"
import InboxLayout from "app/inbox/layout/InboxLayout"
import ProjectInviteItem from "app/inbox/components/ProjectInviteItem"
import NotificationItemWrapper from "app/inbox/components/NotificationItemWrapper"

type InboxInvitesPageProps = {
  invites: Array<{
    id: number
    createdAt: Date
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

  const handleFilterInvites = (id: number) =>
    setInvites(invites.filter((invite) => invite.id !== id))

  return (
    <Grid container spacing={2}>
      <Timeline sx={{ paddingRight: 0 }}>
        {invites.map((invite) => (
          <NotificationItemWrapper key={invite.id} id={invite.id} createdAt={invite.createdAt}>
            <ProjectInviteItem key={invite.id} invite={invite} onActionDone={handleFilterInvites} />
          </NotificationItemWrapper>
        ))}
      </Timeline>
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
