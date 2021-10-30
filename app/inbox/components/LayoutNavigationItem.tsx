import { RouteUrlObject, useRouter } from "blitz"
import { SvgIcon, Grid, Box, Badge } from "@mui/material"
import { ButtonRouteLink } from "app/core/components/links"
import useNotificationsCounter from "../hooks/useNotificationsCounter"
import { useMemo } from "react"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"

type NotificationFilter = "all" | "invites" | "feedback" | "changelogs" | "saved"

type LayoutNavigationItemProps = {
  href: RouteUrlObject | string
  label: string
  pathname: string
  notificationFilter: NotificationFilter
  icon: typeof SvgIcon
}

const LayoutNavigationItem: React.FC<LayoutNavigationItemProps> = ({
  href,
  icon,
  label,
  pathname,
  notificationFilter,
}) => {
  const router = useRouter()

  const isSM = useIsSmallDevice()

  const isActiveRoute = router.pathname === pathname

  const [notifications] = useNotificationsCounter(false)

  const notificationsCounter = useMemo(() => {
    if (notifications) {
      switch (notificationFilter) {
        case "changelogs": {
          const { newChangelogNotifications } = notifications
          return newChangelogNotifications.length
        }
        case "feedback": {
          const { newChangelogNotifications, projectInvites, ...feedbackNotifications } =
            notifications
          return Object.values(feedbackNotifications).flat().length
        }
        case "invites": {
          const { projectInvites } = notifications
          return projectInvites.length
        }
        case "saved": {
          return Object.values(notifications)
            .flat()
            .filter(({ isSaved }) => isSaved).length
        }
        default:
          return Object.values(notifications).flat().length
      }
    }
  }, [notifications, notificationFilter])

  const Icon = icon

  return (
    <Grid item xs={2} md={12}>
      <ButtonRouteLink
        href={href}
        fullWidth
        variant={isActiveRoute ? "contained" : "text"}
        color="primary"
        disableElevation
        startIcon={isSM ? null : <Icon fontSize="large" />}
        endIcon={
          isSM ? null : (
            <Badge
              badgeContent={notificationsCounter}
              color="primary"
              max={999}
              sx={{
                position: "static",
                ".MuiBadge-badge": {
                  top: "50%",
                  right: 25,
                  color: isActiveRoute ? "text.primary" : undefined,
                  bgcolor: isActiveRoute ? "background.default" : "secondary.main",
                },
              }}
            />
          )
        }
        sx={{
          textTransform: "none",
          justifyContent: isSM ? undefined : "flex-start",
          paddingX: 2,
          position: "relative",
        }}
        size="large"
      >
        {isSM ? <Icon /> : label}
      </ButtonRouteLink>
    </Grid>
  )
}

export default LayoutNavigationItem
