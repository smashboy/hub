import { useQuery } from "blitz"
import { List, Grid, Divider } from "@mui/material"
import getFeedbackMessages from "../queries/getFeedbackMessages"
import MessageItem from "app/core/components/MessageItem"
import FeedbackMessageEditor from "./FeedbackMessageEditor"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import updateFeedbackMessage from "../mutations/updateFeedbackMessage"
import deleteFeedbackMessage from "../mutations/deleteFeedbackMessage"

export interface FeedbackMessagesListProps {
  feedbackId: number
  isPublic: boolean
}

// const getMessagesInput =
//   (feedbackId: number, isPublic: boolean) =>
//   (page: GetFeedbackMessagesInput = { take: 10, skip: 0, feedbackId, isPublic }) =>
//     page

const FeedbackMessagesList: React.FC<FeedbackMessagesListProps> = ({ feedbackId, isPublic }) => {
  const user = useCurrentUser()

  const [updateFeedbackMessageMutation] = useCustomMutation(updateFeedbackMessage, {
    successNotification: "Message has been updated successfully!",
  })

  const [deleteFeedbackMessageMutation] = useCustomMutation(deleteFeedbackMessage, {
    successNotification: "Message has been deleted successfully!",
  })

  const [messages, { refetch }] = useQuery(getFeedbackMessages, {
    feedbackId,
    isPublic,
  })

  const handleUpdateMessage = async (id: number, content: string) => {
    await updateFeedbackMessageMutation({
      messageId: id,
      content,
    })
    refetch()
  }

  const handleDeleteMessage = async (id: number) => {
    await deleteFeedbackMessageMutation({
      messageId: id,
    })
    refetch()
  }

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        <List component="div">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              onMessageUpdate={handleUpdateMessage}
              onMessageDelete={handleDeleteMessage}
            />
          ))}
        </List>
      </Grid>
      {user && (
        <>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <FeedbackMessageEditor feedbackId={feedbackId} isPublic={isPublic} refetch={refetch} />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default FeedbackMessagesList
