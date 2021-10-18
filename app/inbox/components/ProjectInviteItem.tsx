import { Routes } from "blitz"
import { Grid, Paper, Typography, Avatar } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { RouteLink } from "app/core/components/links"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import acceptProjectInvite from "app/project/mutations/acceptProjectInvite"
import declineProjectInvite from "app/project/mutations/declineProjectInvite"

type ProjectInviteItemProps = {
  invite: {
    id: number
    project: {
      name: string
      slug: string
      description: string | null
      logoUrl: string | null
    }
  }
  onActionDone: (inviteId: number) => void
}

const ProjectInviteItem: React.FC<ProjectInviteItemProps> = ({
  invite: {
    id,
    project: { name, slug, description, logoUrl },
  },
  onActionDone,
}) => {
  const [acceptProjectInviteMutation, { isLoading: isLoadingAccept }] = useCustomMutation(
    acceptProjectInvite,
    {
      successNotification: "Invitation accepted!",
    }
  )

  const [declineProjectInviteMutation, { isLoading: isLoadingDeclined }] = useCustomMutation(
    declineProjectInvite,
    {
      successNotification: "Invitation declined!",
    }
  )

  const handleAccept = async () => {
    await acceptProjectInviteMutation({
      inviteId: id,
    })

    onActionDone(id)
  }

  const handleDecline = async () => {
    await declineProjectInviteMutation({
      inviteId: id,
    })

    onActionDone(id)
  }

  return (
    <Grid item xs={12}>
      <Paper sx={{ padding: 1 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid container item xs={12} md={8}>
            <Grid container item xs={2} justifyContent="center" alignItems="center">
              <Avatar src="broken" alt={name} />
            </Grid>
            <Grid container item xs={10}>
              <Grid item xs={12}>
                <RouteLink href={Routes.ProjectLandingPage({ slug })} variant="h6">
                  {name}
                </RouteLink>
              </Grid>
              {description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" component="div" color="text.secondary">
                    {description}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={6} md={2}>
            <LoadingButton
              color="error"
              variant="contained"
              loading={isLoadingDeclined}
              onClick={handleDecline}
              disableElevation
              fullWidth
            >
              Decline
            </LoadingButton>
          </Grid>
          <Grid item xs={6} md={2}>
            <LoadingButton
              color="success"
              variant="contained"
              loading={isLoadingAccept}
              onClick={handleAccept}
              disableElevation
              fullWidth
            >
              Accept
            </LoadingButton>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default ProjectInviteItem
