import { ReactNode, Suspense, useState } from "react"
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
  Divider,
  Fade,
  Container,
  Box,
  Hidden,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import { isSSR } from "../utils/blitz"
import LogoutIcon from "@mui/icons-material/Logout"
import SettingsIcon from "@mui/icons-material/Settings"
import AddIcon from "@mui/icons-material/Add"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { ButtonRouteLink, RouteLink } from "../components/links"
import logout from "app/auth/mutations/logout"

export interface LayoutProps {
  title?: string
  children: ReactNode
}

export interface MainLayoutProps extends LayoutProps {
  disableNavigation?: boolean
  disableContainer?: boolean
}

const AuthNavigation = () => {
  const user = useCurrentUser()

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
                href="/requests"
                variant="button"
                color="#fff"
                sx={{ marginRight: 3 }}
                withAlpha
              >
                Requests
              </RouteLink>
            </Hidden>
            <Avatar
              onClick={handleOpenMenu}
              src="broken"
              alt={user.username}
              sx={{ cursor: "pointer" }}
            />
          </Box>
        </Fade>
        <Menu anchorEl={menuEl} open={Boolean(menuEl)} onClose={handleCloseMenu}>
          <Link href={Routes.ProjectsPage()} passHref>
            <MenuItem onClick={handleCloseMenu} component="a">
              <ListItemText primary="Your projects" />
            </MenuItem>
          </Link>
          <MenuItem onClick={handleCloseMenu}>
            <ListItemText primary="Your requests" />
          </MenuItem>
          <Divider variant="middle" />
          <Link href={Routes.NewProjectPage()} passHref>
            <MenuItem onClick={handleCloseMenu} component="a">
              <ListItemIcon>
                <AddIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="New project" />
            </MenuItem>
          </Link>
          <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <SettingsIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Account settings" />
          </MenuItem>
          <Divider variant="middle" />
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
    <Skeleton variant="text" sx={{ marginRight: 3, width: 40 }} />
    <Skeleton variant="text" sx={{ marginRight: 3, width: 40 }} />
    <Skeleton variant="circular" width={40} height={40} />
  </>
)

const Layout = ({ title, disableContainer, disableNavigation, children }: MainLayoutProps) => {
  const theme = useTheme()

  const scrollTrigger = useScrollTrigger({
    target: isSSR() ? undefined : window,
    disableHysteresis: true,
    threshold: 10,
  })

  return (
    <>
      <Head>
        <title>{title || "projecthub"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!disableNavigation && (
        <AppBar
          position="sticky"
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
      {disableContainer ? children : <Container>{children}</Container>}
    </>
  )
}

export default Layout
