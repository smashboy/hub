import { Routes } from "blitz"
import { Grid, Paper, Fade, Container, Divider, Hidden } from "@mui/material"
import InboxIcon from "@mui/icons-material/Inbox"
import InviteIcon from "@mui/icons-material/PersonAdd"
import SavedIcon from "@mui/icons-material/BookmarkBorder"
import ChangelogIcon from "@mui/icons-material/LibraryBooks"
import FeedbackIcon from "@mui/icons-material/Feed"
// import JobsIcon from "@mui/icons-material/Work"
import Layout, { LayoutProps } from "app/core/layouts/Layout"
import LayoutNavigationItem from "../components/LayoutNavigationItem"

// type InboxTab = "all" | "invites" | "jobs"

// type InboxLayoutProps = {
//   selectedTab: InboxTab
// }

const InboxLayout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <Layout title={title} disableContainer>
      <Container maxWidth="xl">
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Fade in timeout={500}>
            <Grid container item xs={12} md={2}>
              <Paper
                variant="outlined"
                sx={{ bgcolor: "transparent", padding: 1, width: "100%", height: "fit-content" }}
              >
                <Grid container xs={12} rowSpacing={1}>
                  <LayoutNavigationItem
                    href={Routes.InboxAllPage()}
                    label="Changelogs"
                    pathname="/inbox/changelogs"
                    icon={ChangelogIcon}
                  />
                  <Hidden smDown>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Hidden>
                  <LayoutNavigationItem
                    href={Routes.InboxAllPage()}
                    label="All"
                    pathname="/inbox"
                    icon={InboxIcon}
                  />
                  <LayoutNavigationItem
                    href={Routes.InboxAllPage()}
                    label="Saved"
                    pathname="/inbox/saved"
                    icon={SavedIcon}
                  />
                  <Hidden smDown>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Hidden>

                  <LayoutNavigationItem
                    href={Routes.InboxInvitesPage()}
                    label="Invites"
                    pathname="/inbox/invites"
                    notificationKey="projectInvites"
                    icon={InviteIcon}
                  />
                  <LayoutNavigationItem
                    href={Routes.InboxInvitesPage()}
                    label="Feedback"
                    pathname="/inbox/feedback"
                    notificationKey="projectInvites"
                    icon={FeedbackIcon}
                  />
                  {/* <LayoutNavigationItem
                    href={Routes.InboxJobsPage()}
                    label="Jobs"
                    pathname="/inbox/jobs"
                    icon={JobsIcon}
                    notificationKey={false}
                  /> */}
                </Grid>
              </Paper>
            </Grid>
          </Fade>
          <Grid item xs={12} md={10}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}

export default InboxLayout
