import { NotificationsPrismaModelKey } from "../hooks/useNotificationsManager"
import ChangelogNotificationItem from "./ChangelogNotificationItem"
import FeedbackNotificationItem from "./FeedbackNotificationItem"
import ProjectInviteItem from "./ProjectInviteItem"

const NotificationSelector: React.FC<{ modelKey: NotificationsPrismaModelKey; props: any }> = ({
  modelKey,
  props,
}) => {
  switch (modelKey) {
    case "newChangelogNotification":
      return <ChangelogNotificationItem notification={props} />
    case "feedbackNotification":
      return <FeedbackNotificationItem notification={props} />
    case "projectInvite":
      return <ProjectInviteItem invite={props} />
    default:
      return null
  }
}
export default NotificationSelector
