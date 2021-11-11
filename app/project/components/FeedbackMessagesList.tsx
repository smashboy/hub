import { useQuery } from "blitz"
import { List, Grid, Divider } from "@mui/material"
import getFeedbackMessages from "../queries/getFeedbackMessages"
import MessageItem from "app/core/components/MessageItem"
import FeedbackMessageEditor from "./FeedbackMessageEditor"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import updateFeedbackMessage from "../mutations/updateFeedbackMessage"
import deleteFeedbackMessage from "../mutations/deleteFeedbackMessage"
import { feedbackOptionsDrawerBleeding } from "./FeedbackEditor/FeedbackOptions"
import { FeedbackMessageCategory } from "db"
import Alert from "app/core/components/Alert"

export interface FeedbackMessagesListProps {
  feedbackId: number
  category: FeedbackMessageCategory
  slug: string
}

// const getMessagesInput =
//   (feedbackId: number, isPublic: boolean) =>
//   (page: GetFeedbackMessagesInput = { take: 10, skip: 0, feedbackId, isPublic }) =>
//     page

const FeedbackMessagesList: React.FC<FeedbackMessagesListProps> = ({
  feedbackId,
  category,
  slug,
}) => {
  const user = useCurrentUser()

  const [updateFeedbackMessageMutation] = useCustomMutation(updateFeedbackMessage, {
    successNotification: "Message has been updated successfully!",
  })

  const [deleteFeedbackMessageMutation] = useCustomMutation(deleteFeedbackMessage, {})

  const [messages, { refetch }] = useQuery(getFeedbackMessages, {
    feedbackId,
    category,
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
    <Grid
      container
      item
      xs={12}
      spacing={2}
      sx={{ paddingBottom: `${feedbackOptionsDrawerBleeding + 10}px` }}
    >
      <>
        {category === FeedbackMessageCategory.PRIVATE && (
          <Grid item xs={12}>
            <Alert severity="info">
              This tab is available only for feedback author and project members.
            </Alert>
          </Grid>
        )}
        {messages.length > 0 && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
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
          </>
        )}
      </>
      {user && (
        <Grid item xs={12}>
          <FeedbackMessageEditor
            feedbackId={feedbackId}
            category={category}
            refetch={refetch}
            slug={slug}
          />
        </Grid>
      )}
    </Grid>
  )
}

export default FeedbackMessagesList
