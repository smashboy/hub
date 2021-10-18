import db from "db"
import { useState } from "react"
import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Grid } from "@mui/material"
import { authConfig } from "app/core/configs/authConfig"
import InboxLayout from "app/inbox/layout/InboxLayout"
import ProjectInviteItem from "app/inbox/components/ProjectInviteItem"

type InboxInvitesPageProps = {
  invites: Array<{
    id: number
    project: {
      name: string
      slug: string
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
      {invites.map((invite) => (
        <ProjectInviteItem key={invite.id} invite={invite} onActionDone={handleFilterInvites} />
      ))}
    </Grid>
  )
}

InboxInvitesPage.authenticate = authConfig

InboxInvitesPage.getLayout = (page) => (
  <InboxLayout title="Inbox" selectedTab="invites">
    {page}
  </InboxLayout>
)

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  const authUserId = session.userId!

  const invites = await db.projectInvite.findMany({
    where: {
      userId: authUserId,
    },
    select: {
      id: true,
      project: {
        select: {
          name: true,
          slug: true,
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
