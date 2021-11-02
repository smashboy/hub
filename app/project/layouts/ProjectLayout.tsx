import { useMemo, useState } from "react"
import { Routes } from "blitz"
import { Avatar, Typography, Grid, Container, Tabs, Tab, Fade } from "@mui/material"
import { ButtonWebLink, ButtonRouteLink, TabRouteLink } from "app/core/components/links"
import Layout, { LayoutProps } from "app/core/layouts/Layout"
import OpenIcon from "@mui/icons-material/OpenInNew"
import EditIcon from "@mui/icons-material/Edit"
import FollowIcon from "@mui/icons-material/Stars"
import SettingsIcon from "@mui/icons-material/Settings"
import { ProjectPageProps } from "../helpers"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import followProject from "../mutations/followProject"
import { LoadingButton } from "@mui/lab"
import { ProjectMemberRole } from "db"
import useCustomMutation from "app/core/hooks/useCustomMutation"

type ProjectLayoutProps = {
  selectedTab: "landing" | "changelogs" | "roadmaps" | "jobs" | "feedback"
}

const ProjectLayout: React.FC<LayoutProps & ProjectPageProps & ProjectLayoutProps> = ({
  title,
  children,
  selectedTab,
  project: { name, description, logoUrl, websiteUrl, color, slug, role, isFollowing },
}) => {
  const isSM = useIsSmallDevice()

  const [following, setIsFollowing] = useState(isFollowing)

  const [followMutation, { isLoading: isLoadingFollow }] = useCustomMutation(followProject, {})

  const user = useCurrentUser(false)

  const websiteHost = useMemo(() => (websiteUrl ? new URL(websiteUrl).host : null), [websiteUrl])

  const avatarSize = useMemo(() => (isSM ? 55 : 65), [isSM])

  return (
    <Layout title={title}>
      <Grid container rowSpacing={1} sx={{ marginTop: 1 }}>
        <Grid item xs={12}>
          <Container maxWidth="md">
            <Grid container rowSpacing={1}>
              <Fade in timeout={350}>
                <Grid container>
                  <Grid container item xs={3} md={2} justifyContent="flex-end" alignItems="center">
                    <Avatar
                      src="broken"
                      alt={name}
                      sx={{
                        bgcolor: color,
                        width: avatarSize,
                        height: avatarSize,
                        fontSize: 32,
                        marginRight: 3,
                      }}
                    />
                  </Grid>
                  <Grid container item xs={9} md={10} alignItems="flex-start">
                    <Grid item xs={12}>
                      <Typography variant={isSM ? "h5" : "h4"} color="text.primary">
                        {name}
                      </Typography>
                    </Grid>
                    {description && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" color="text.secondary">
                          {description}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Fade>
              <Fade in timeout={500}>
                <Grid container item xs={12} spacing={1}>
                  {user && (
                    <Grid item xs={12} md={3}>
                      <ButtonRouteLink
                        href={Routes.CreateFeedbackPage({ slug })}
                        variant="contained"
                        size="small"
                        endIcon={<EditIcon />}
                        fullWidth
                      >
                        Give feedback
                      </ButtonRouteLink>
                    </Grid>
                  )}
                  {user && role !== ProjectMemberRole.FOUNDER && (
                    <Grid item xs={6} md={2}>
                      <LoadingButton
                        variant="contained"
                        sx={{ bgcolor: color }}
                        size="small"
                        loading={isLoadingFollow}
                        onClick={async () => {
                          const newStatus = await followMutation({ slug })
                          setIsFollowing(newStatus)
                        }}
                        endIcon={<FollowIcon />}
                        fullWidth
                      >
                        {following ? "Unfollow" : "Follow"}
                      </LoadingButton>
                    </Grid>
                  )}
                  {websiteHost && websiteUrl && (
                    <Grid item xs={6} md={2}>
                      <ButtonWebLink
                        href={websiteUrl}
                        variant="contained"
                        color="secondary"
                        size="small"
                        endIcon={<OpenIcon />}
                        fullWidth
                      >
                        website
                      </ButtonWebLink>
                    </Grid>
                  )}
                  {user &&
                    (role === ProjectMemberRole.FOUNDER || role === ProjectMemberRole.ADMIN) && (
                      <Grid item xs={6} md={2}>
                        <ButtonRouteLink
                          href={Routes.SettingsPage({
                            slug,
                          })}
                          variant="contained"
                          size="small"
                          color="secondary"
                          endIcon={<SettingsIcon />}
                          fullWidth
                        >
                          Settings
                        </ButtonRouteLink>
                      </Grid>
                    )}
                </Grid>
              </Fade>
            </Grid>
          </Container>
        </Grid>
        <Fade in timeout={750}>
          <Grid item xs={12}>
            <Tabs
              value={selectedTab}
              variant={isSM ? "scrollable" : "standard"}
              scrollButtons="auto"
              centered={!isSM}
            >
              <TabRouteLink
                href={Routes.ProjectLandingPage({ slug })}
                value="landing"
                label="Home"
              />
              <TabRouteLink
                href={Routes.ChangelogListPage({ slug })}
                value="changelogs"
                label="Changelogs"
              />
              <TabRouteLink
                href={Routes.FeedbackPage({ slug })}
                value="feedback"
                label="Feedback"
              />
              <TabRouteLink
                href={Routes.RoadmapsPage({ slug })}
                value="roadmaps"
                label="Roadmaps"
              />
              {/* <Tab value="jobs" label="Jobs" /> */}
            </Tabs>
          </Grid>
        </Fade>
      </Grid>
      {children}
    </Layout>
  )
}

export default ProjectLayout
