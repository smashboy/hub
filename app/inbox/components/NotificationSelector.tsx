import { FeedbackNotification, NewChangelogNotification } from "db"
import ChangelogNotificationItem from "./ChangelogNotificationItem"
import FeedbackNotificationItem from "./FeedbackNotificationItem"
import ProjectInviteItem from "./ProjectInviteItem"

type NotificationSelectorProps = {
  notification: {
    feedbackNotification: FeedbackNotification | null
    newChangelogNotification: NewChangelogNotification | null
    projectInvite: {
      id: number
      project: {
        name: string
        slug: string
        isPrivate: boolean
        description: string | null
        logoUrl: string | null
      }
    } | null
  }
  onInviteActionDone: () => void
}

const NotificationSelector: React.FC<NotificationSelectorProps> = ({
  notification: { feedbackNotification, projectInvite, newChangelogNotification },
  onInviteActionDone,
}) => {
  if (newChangelogNotification) {
    return <ChangelogNotificationItem notification={newChangelogNotification} />
  } else if (feedbackNotification) {
    return <FeedbackNotificationItem notification={feedbackNotification} />
  } else if (projectInvite) {
    return <ProjectInviteItem invite={projectInvite} onActionDone={onInviteActionDone} />
  } else {
    return null
  }
}
export default NotificationSelector
