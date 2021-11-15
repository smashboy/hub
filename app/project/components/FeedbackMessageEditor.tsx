import { Descendant } from "slate"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import Editor from "app/editor/Editor"
import createFeedbackMessage from "app/project/mutations/createFeedbackMessage"
import { FeedbackMessagesListProps } from "./FeedbackMessagesList"
import { useProject } from "../store/ProjectContext"

interface FeedbackMessageEditor extends FeedbackMessagesListProps {
  refetch: () => void
}

const FeedbackMessageEditor: React.FC<FeedbackMessageEditor> = ({
  feedbackId,
  category,
  refetch,
}) => {
  const {
    project: { slug },
  } = useProject()

  const [createFeedbackMessageMutation] = useCustomMutation(createFeedbackMessage, {})

  const handleCreateNewMessage = async (content: Descendant[]) => {
    await createFeedbackMessageMutation({
      feedbackId,
      category,
      projectSlug: slug,
      content: JSON.stringify({ content }),
    })
    refetch()
  }

  return (
    <Editor
      submitText="Comment"
      height={100}
      bucketId="feedback-messages"
      onSubmit={handleCreateNewMessage}
    />
  )
}

export default FeedbackMessageEditor
