import { FeedbackNotification, FeedbackNotificationType } from "db"
import { Routes } from "blitz"
import { Paper, ListItem, ListItemText, Chip } from "@mui/material"
import { RouteLink } from "app/core/components/links"

const _messageSelector = ({
  type,
  projectName,
  feedbackTitle,
  projectSlug,
  feedbackId,
  newStatus,
}: FeedbackNotification) => {
  switch (type) {
    case FeedbackNotificationType.ASSIGNED:
      return (
        <>
          <b>Assigned:</b> You have been assigned as a participant to the{" "}
          <RouteLink href={Routes.SelectedFeedbackPage({ slug: projectSlug, id: feedbackId })}>
            {feedbackTitle}
          </RouteLink>{" "}
          feedback in{" "}
          <RouteLink href={Routes.ProjectLandingPage({ slug: projectSlug })}>
            {projectName}
          </RouteLink>{" "}
          project.
        </>
      )
    case FeedbackNotificationType.STATUS_CHANGED:
      return (
        <>
          <b>New status:</b> Status of the{" "}
          <RouteLink href={Routes.SelectedFeedbackPage({ slug: projectSlug, id: feedbackId })}>
            {`${feedbackTitle}`}
          </RouteLink>{" "}
          feedback in{" "}
          <RouteLink href={Routes.ProjectLandingPage({ slug: projectSlug })}>
            {projectName}
          </RouteLink>{" "}
          project has been changed to <Chip label={newStatus?.replace("_", " ")} size="small" />
        </>
      ) // TODO label selector
    case FeedbackNotificationType.NEW_PUBLIC_MESSAGE:
      return (
        <>
          <b> New message:</b> New public message in the{" "}
          <RouteLink href={Routes.SelectedFeedbackPage({ slug: projectSlug, id: feedbackId })}>
            {`${feedbackTitle}`}
          </RouteLink>{" "}
          feedback.
        </>
      )
    case FeedbackNotificationType.NEW_PRIVATE_MESSAGE:
      return (
        <>
          <b>New message:</b> New private message in the{" "}
          <RouteLink href={Routes.SelectedFeedbackPage({ slug: projectSlug, id: feedbackId })}>
            {`${feedbackTitle}`}
          </RouteLink>{" "}
          feedback.
        </>
      )
    case FeedbackNotificationType.NEW_INTERNAL_MESSAGE:
      return (
        <>
          <b>New message:</b> New internal message in the feedback{" "}
          <RouteLink href={Routes.SelectedFeedbackPage({ slug: projectSlug, id: feedbackId })}>
            {`(${feedbackTitle})`}
          </RouteLink>
          .
        </>
      )
    default:
      return ""
  }
}

const FeedbackNotificationItem: React.FC<{ notification: FeedbackNotification }> = ({
  notification,
}) => {
  const { projectSlug, feedbackId } = notification

  return (
    <Paper>
      <ListItem component="div">
        <ListItemText
          primary={_messageSelector(notification)}
          secondary={
            <RouteLink href={Routes.SelectedFeedbackPage({ slug: projectSlug, id: feedbackId })}>
              {`${projectSlug} #${feedbackId}`}
            </RouteLink>
          }
          primaryTypographyProps={{
            component: "div",
          }}
          secondaryTypographyProps={{
            component: "div",
          }}
        />
      </ListItem>
    </Paper>
  )
}

export default FeedbackNotificationItem
