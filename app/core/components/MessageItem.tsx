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
  Grid,
  MenuItem,
} from "@mui/material"
import MoreIcon from "@mui/icons-material/MoreVert"
import MarkdownEditor from "../markdown/Editor"
import { useCurrentUser } from "../hooks/useCurrentUser"
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
  onMessageUpdate: (id: number, content: string) => Promise<void>
  onMessageDelete: (id: number) => Promise<void>
}

const MessageItem: React.FC<MessageItemProps> = ({
  message: {
    author: { avatarUrl, username, id: authorId },
    id,
    content,
    createdAt,
  },
  onMessageUpdate,
  onMessageDelete,
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
    await onMessageUpdate(id, JSON.stringify({ content: newContent }))
    handleCloseEdit()
  }

  const handleDeleteMessage = async () => {
    await onMessageDelete(id)
    handleCloseMenu()
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
            <Grid container columnSpacing={1} alignItems="center">
              <Grid item xs="auto">
                <Typography variant="subtitle1" color="text.primary" component="div">
                  {username}
                </Typography>
              </Grid>
              <Grid item xs="auto">
                <Typography variant="subtitle2" color="text.secondary" component="div">
                  {`commented ${formatRelative(createdAt, new Date())}`}
                </Typography>
              </Grid>
            </Grid>
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
                updateOnRerender
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
        <MenuItem onClick={handleDeleteMessage}>Delete</MenuItem>
      </Menu>
    </>
  )
}

export default MessageItem
