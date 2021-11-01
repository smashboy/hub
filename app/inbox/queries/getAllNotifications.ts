import { resolver } from "blitz"
import Guard from "app/guard/ability"
import getInvitesNotifications, { GetNotificationsInput } from "./getInvitesNotifications"
import getChangelogNotifications from "./getChangelogNotifications"
import getFeedbackNotifications from "./getFeedbackNotifications"

export type GetAllNotificationsInput = {
  changelogInput: GetNotificationsInput
  feedbackInput: GetNotificationsInput
  invitesInput: GetNotificationsInput
}

export default resolver.pipe(
  Guard.authorizePipe("read", "user.notifications"),
  async ({ changelogInput, feedbackInput, invitesInput }: GetAllNotificationsInput, ctx) => {
    console.log(changelogInput, feedbackInput, invitesInput)

    const [changelogNotifications, inviteNotifications, feedbackNotifications] = await Promise.all([
      getChangelogNotifications(changelogInput, ctx),
      getInvitesNotifications(invitesInput, ctx),
      getFeedbackNotifications(feedbackInput, ctx),
    ])

    return {
      newChangelogNotifications: changelogNotifications,
      projectInvites: inviteNotifications,
      feedbackNotifications: feedbackNotifications,
    }
  }
)
