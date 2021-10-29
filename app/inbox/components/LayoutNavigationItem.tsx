import { RouteUrlObject, useRouter } from "blitz"
import { SvgIcon, Grid, Box, Badge } from "@mui/material"
import { ButtonRouteLink } from "app/core/components/links"
import useNotificationsCounter from "../hooks/useNotificationsCounter"
import { useMemo } from "react"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"

type LayoutNavigationItemProps = {
  href: RouteUrlObject | string
  label: string
  pathname: string
  notificationKey?: "projectInvites" | false
  icon: typeof SvgIcon
}

const LayoutNavigationItem: React.FC<LayoutNavigationItemProps> = ({
  href,
  icon,
  label,
  pathname,
  notificationKey,
}) => {
  const router = useRouter()

  const isSM = useIsSmallDevice()

  const isActiveRoute = router.pathname === pathname

  const [notifications] = useNotificationsCounter(false)

  const notificationsCounter = useMemo(() => {
    if (notificationKey && notifications) return notifications[notificationKey].length
    if (typeof notificationKey === "undefined" && notifications)
      return Object.values(notifications).flat().length
    return 0
  }, [notifications, notificationKey])

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