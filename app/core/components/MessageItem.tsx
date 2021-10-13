import { useState } from "react"
import { formatRelative } from "date-fns"
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material"
import MoreIcon from "@mui/icons-material/MoreVert"
import MarkdownEditor from "../markdown/Editor"
import { useCurrentUser } from "../hooks/useCurrentUser"
import useCustomMutation from "../hooks/useCustomMutation"
import updateFeedbackMessage from "app/project/mutations/updateFeedbackMessage"
import { Descendant } from "slate"

type MessageItemProps = {
  message: {
    id: number
    createdAt: Date
    content: string
    author: {
      id: number
      username: string
      avatarUrl: string | null
    }
  }
  onMessageUpdate?: (id: number, content: string) => Promise<void>
}

const MessageItem: React.FC<MessageItemProps> = ({
  message: {
    author: { avatarUrl, username, id: authorId },
    id,
    content,
    createdAt,
  },
  onMessageUpdate,
}) => {
  const user = useCurrentUser(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [readOnly, setReadOnly] = useState(true)
  const [hideOptions, setHideOptions] = useState(false)

  const open = Boolean(anchorEl)

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)
  const handleCloseMenu = () => setAnchorEl(null)

  const handleEditMessage = () => {
    setReadOnly(false)
    setHideOptions(true)
    handleCloseMenu()
  }

  const handleCloseEdit = () => {
    setReadOnly(true)
    setHideOptions(false)
  }

  const handleUpdateMessage = async (newContent: Descendant[]) => {
    await onMessageUpdate?.(id, JSON.stringify({ content: newContent }))
    handleCloseEdit()
  }

  return (
    <>
      <ListItem
        alignItems="flex-start"
        component="div"
        // sx={{ transform: " rotate(180deg) scaleX(-1)" }}
      >
        <ListItemAvatar>
          <Avatar src={avatarUrl || undefined} alt={username} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle1" color="text.primary" component="div">
                {username}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                component="div"
                sx={{ paddingLeft: 1 }}
              >
                {`commented ${formatRelative(createdAt, new Date())}`}
              </Typography>
            </Box>
          }
          secondary={
            <Box marginTop={readOnly ? 0 : 2}>
              <MarkdownEditor
                editVariant
                readOnly={readOnly}
                height={100}
                disablePadding
                onSubmit={handleUpdateMessage}
                onCancel={handleCloseEdit}
                initialContent={JSON.parse(content)?.content || null}
              />
            </Box>
          }
          disableTypography
          // secondary={content}
        />
        {user?.id === authorId && !hideOptions && (
          <ListItemSecondaryAction>
            <IconButton onClick={handleOpenMenu}>
              <MoreIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      <Menu open={open} anchorEl={anchorEl} onClose={handleCloseMenu}>
        <MenuItem onClick={handleEditMessage}>Edit</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Menu>
    </>
  )
}

export default MessageItem
