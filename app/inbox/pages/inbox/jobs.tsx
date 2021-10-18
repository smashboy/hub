import { BlitzPage } from "blitz"
import { authConfig } from "app/core/configs/authConfig"
import InboxLayout from "app/inbox/layout/InboxLayout"

const InboxJobsPage: BlitzPage = () => {
  return <div />
}

InboxJobsPage.authenticate = authConfig

InboxJobsPage.getLayout = (page) => (
  <InboxLayout title="Inbox" selectedTab="jobs">
    {page}
  </InboxLayout>
)

export default InboxJobsPage
