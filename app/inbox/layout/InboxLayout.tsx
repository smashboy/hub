import { Routes, useRouter } from "blitz"
import { Grid, Tabs, Tab, Paper, Fade } from "@mui/material"
import InboxIcon from "@mui/icons-material/Inbox"
import InviteIcon from "@mui/icons-material/PersonAdd"
import JobsIcon from "@mui/icons-material/Work"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import Layout, { LayoutProps } from "app/core/layouts/Layout"
import { TabRouteLink } from "app/core/components/links"

type InboxLayoutProps = {
  selectedTab: "all" | "invites" | "jobs"
}

const InboxLayout: React.FC<LayoutProps & InboxLayoutProps> = ({
  title,
  selectedTab,
  children,
}) => {
  const isSM = useIsSmallDevice()

  return (
    <Layout title={title}>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Fade in timeout={500}>
          <Grid item xs={12} md={3}>
            <Paper variant="outlined" sx={{ bgcolor: "transparent" }}>
              <Tabs
                value={selectedTab}
                orientation={isSM ? "horizontal" : "vertical"}
                scrollButtons="auto"
                variant="scrollable"
              >
                <TabRouteLink
                  href={Routes.InboxAllPage()}
                  value="all"
                  label="All"
                  icon={<InboxIcon />}
                />
                <TabRouteLink
                  href={Routes.InboxInvitesPage()}
                  value="invites"
                  label="Invites"
                  icon={<InviteIcon />}
                />
                <TabRouteLink
                  href={Routes.InboxJobsPage()}
                  value="jobs"
                  label="Jobs"
                  icon={<JobsIcon />}
                />
              </Tabs>
            </Paper>
          </Grid>
        </Fade>
        <Grid item xs={12} md={9}>
          {children}
        </Grid>
      </Grid>
    </Layout>
  )
}

export default InboxLayout
