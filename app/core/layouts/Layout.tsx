import { ReactNode, Suspense, useState } from "react"
import { NextSeo } from "next-seo"
import { Head, Routes, useMutation, Link } from "blitz"
import LogoIcon from "@mui/icons-material/DeviceHub"
import {
  AppBar,
  Avatar,
  Skeleton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useScrollTrigger,
  useTheme,
  Badge,
  Fade,
  Container,
  Box,
  Hidden,
  IconButton,
} from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"
import { alpha } from "@mui/material/styles"
import { isSSR } from "../utils/blitz"
import LogoutIcon from "@mui/icons-material/Logout"
// import InboxIcon from "@mui/icons-material/Inbox"
// import SettingsIcon from "@mui/icons-material/Settings"
import AddIcon from "@mui/icons-material/Add"
import ProjectsIcon from "@mui/icons-material/Apps"
import FeedbackIcon from "@mui/icons-material/Feed"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { ButtonRouteLink, RouteLink } from "../components/links"
import logout from "app/auth/mutations/logout"

import useNotificationsCounter from "app/inbox/hooks/useNotificationsCounter"

export interface LayoutProps {
  title?: string
  noIndex?: boolean
  disableNavigation?: boolean
  disableContainer?: boolean
  children: ReactNode
}

const AuthNavigation = () => {
  const user = useCurrentUser()

  const [notifications] = useNotificationsCounter()

  const notificationsCounter = notifications ? Object.values(notifications).flat().length : 0

  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLDivElement>) => setMenuEl(event.currentTarget)

  const handleCloseMenu = () => setMenuEl(null)

  const [logoutMutation] = useMutation(logout)

  if (user)
    return (
      <>
        <Fade in>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Hidden smDown>
              <RouteLink
                href={Routes.ProjectsPage()}
                variant="button"
                color="#fff"
                sx={{ marginRight: 3 }}
                withAlpha
              >
                Projects
              </RouteLink>
              <RouteLink
                href={Routes.AuthUserFeedbackPage()}
                variant="button"
                color="#fff"
                sx={{ marginRight: 3 }}
                withAlpha
              >
                Feedback
              </RouteLink>
            </Hidden>
            <Link href={Routes.InboxAllPage()} passHref>
              <IconButton sx={{ marginRight: 2 }} size="small" component="a">
                <Badge
                  badgeContent={notificationsCounter ?? 0}
                  color="primary"
                  max={99}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Link>
            <Avatar
              onClick={handleOpenMenu}
              src="broken"
              alt={user.username}
              sx={{ cursor: "pointer" }}
            />
          </Box>
        </Fade>
        <Menu anchorEl={menuEl} open={Boolean(menuEl)} onClose={handleCloseMenu}>
          {/* <Link href={Routes.InboxAllPage()} passHref>
            <MenuItem onClick={handleCloseMenu} component="a">
              <ListItemIcon>
                <InboxIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </MenuItem>
          </Link> */}
          <Link href={Routes.ProjectsPage()} passHref>
            <MenuItem onClick={handleCloseMenu} component="a">
              <ListItemIcon>
                <ProjectsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Your projects" />
            </MenuItem>
          </Link>
          <Link href={Routes.AuthUserFeedbackPage()} passHref>
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon>
                <FeedbackIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Your feedback" />
            </MenuItem>
          </Link>
          {/* <Divider variant="middle" /> */}
          <Link href={Routes.NewProjectPage()} passHref>
            <MenuItem onClick={handleCloseMenu} component="a">
              <ListItemIcon>
                <AddIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="New project" />
            </MenuItem>
          </Link>
          {/* <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <SettingsIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Account settings" />
          </MenuItem> */}
          {/* <Divider variant="middle" /> */}
          <MenuItem
            onClick={async () => {
              await logoutMutation()
              handleCloseMenu()
            }}
          >
            <ListItemIcon>
              <LogoutIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </>
    )

  return (
    <ButtonRouteLink href="/login" variant="contained" color="primary">
      Login
    </ButtonRouteLink>
  )
}

const AuthNavigationPlaceholder = () => (
  <>
    <Hidden smDown>
      <Skeleton variant="text" sx={{ marginRight: 3, width: 40 }} />
      <Skeleton variant="text" sx={{ marginRight: 3, width: 40 }} />
    </Hidden>
    <Skeleton variant="circular" width={20} height={20} sx={{ marginRight: 3 }} />
    <Skeleton variant="circular" width={40} height={40} />
  </>
)

const Layout = ({ title, disableContainer, disableNavigation, children, noIndex }: LayoutProps) => {
  const theme = useTheme()

  const scrollTrigger = useScrollTrigger({
    target: isSSR() ? undefined : window,
    disableHysteresis: true,
    threshold: 10,
  })

  return (
    <>
      <NextSeo
        title={title ? `${title} | Project Hub` : "Project Hub"}
        description="Project Hub is all in one place for developers and customers, collect feedback, create roadmaps, and publish change logs with other useful tools."
        noindex={noIndex}
        nofollow={noIndex}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon.ico",
          },
        ]}
      />

      {!disableNavigation && (
        <AppBar
          position="fixed"
          elevation={scrollTrigger ? 1 : 0}
          sx={
            scrollTrigger
              ? {
                  backgroundColor: alpha(theme.palette.background.default, 0.25),
                  backdropFilter: "blur(8px)",
                }
              : { backgroundColor: "transparent" }
          }
        >
          <Toolbar>
            <LogoIcon color="primary" />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: 1 }}>
              Project Hub
            </Typography>
            <Suspense fallback={<AuthNavigationPlaceholder />}>
              <AuthNavigation />
            </Suspense>
          </Toolbar>
        </AppBar>
      )}
      <Box sx={{ marginTop: 7, paddingBottom: 5 }}>
        {disableContainer ? children : <Container>{children}</Container>}
      </Box>
    </>
  )
}

export default Layout
