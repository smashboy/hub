import { BlitzPage } from "blitz"
import { authConfig } from "app/core/configs/authConfig"
import InboxLayout from "app/inbox/layout/InboxLayout"

const InboxAllPage: BlitzPage = () => {
  return <div />
}

InboxAllPage.authenticate = authConfig

InboxAllPage.getLayout = (page) => (
  <InboxLayout title="Inbox" selectedTab="all">
    {page}
  </InboxLayout>
)

export default InboxAllPage
