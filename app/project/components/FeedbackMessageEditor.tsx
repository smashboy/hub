import { Descendant } from "slate"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import MarkdownEditor from "app/core/markdown/Editor"
import createFeedbackMessage from "app/project/mutations/createFeedbackMessage"
import { FeedbackMessagesListProps } from "./FeedbackMessagesList"

interface FeedbackMessageEditor extends FeedbackMessagesListProps {
  refetch: () => void
  slug: string
}

const FeedbackMessageEditor: React.FC<FeedbackMessageEditor> = ({
  feedbackId,
  category,
  slug,
  refetch,
}) => {
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

  return <MarkdownEditor submitText="Comment" height={100} onSubmit={handleCreateNewMessage} />
}

export default FeedbackMessageEditor
