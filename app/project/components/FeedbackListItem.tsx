import { FeedbackCategory, FeedbackStatus, ProjectMemberRole } from "db"
import { Link, Routes } from "blitz"
import UpvoteIcon from "@mui/icons-material/ArrowDropUp"
import {
  ListItem,
  ListItemText,
  Fade,
  Grid,
  Chip,
  Box,
  ListItemIcon,
  Typography,
  Avatar,
  AvatarGroup,
} from "@mui/material"
import { formatRelative } from "date-fns"

type FeedbackListItemProps = {
  slug: string
  role?: ProjectMemberRole | null
  feedback: {
    id: number
    title: string
    category: FeedbackCategory
    status: FeedbackStatus
    createdAt: Date
    author: {
      username: string
    }
    _count: {
      upvotedBy: number
    } | null
    participants?: Array<{ user: { avatarUrl: string | null; username: string } }>
    labels?: Array<{
      id: string
      name: string
      color: string
    }>
  }
}

const FeedbackListItem: React.FC<FeedbackListItemProps> = ({
  slug,
  role,
  feedback: {
    status,
    title,
    id,
    createdAt,
    labels,
    _count,
    author: { username },
    participants,
  },
}) => {
  return (
    <Fade in timeout={500}>
      <Box>
        <Link href={Routes.SelectedFeedbackPage({ slug, id })} passHref>
          <ListItem component="a" button divider>
            <ListItemIcon sx={{ alignItems: "center", justifyContent: "center" }}>
              <Typography variant="subtitle1" component="div">
                {_count?.upvotedBy || 0}
              </Typography>
              <UpvoteIcon />
            </ListItemIcon>
            <ListItemText
              primary={title}
              secondary={
                <Grid container spacing={1}>
                  <Grid item xs={12}>{`#${id} opened ${formatRelative(
                    createdAt,
                    new Date()
                  )} by ${username}`}</Grid>
                  <Grid item xs={12}>
                    <Chip label={status.replace("_", " ")} size="small" />
                  </Grid>

                  {role && labels && labels.length > 0 && (
                    <Grid container item xs={12} spacing={1}>
                      {labels.map(({ id, name, color }) => (
                        <Grid key={id} item xs="auto">
                          <Chip label={name} key={name} sx={{ bgcolor: color }} size="small" />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                  {participants && (
                    <Grid item xs={12} sx={{ ".MuiAvatarGroup-avatar": { width: 30, height: 30 } }}>
                      <AvatarGroup max={4}>
                        {participants.map(({ user: { avatarUrl, username } }) => (
                          <Avatar key={username} src="broken" alt={username} />
                        ))}
                      </AvatarGroup>
                    </Grid>
                  )}
                </Grid>
              }
              primaryTypographyProps={{
                variant: "h6",
                component: "div",
                sx: {
                  color: "text.primary",
                },
              }}
              secondaryTypographyProps={{
                component: "div",
              }}
            />
          </ListItem>
        </Link>
      </Box>
    </Fade>
  )
}

export default FeedbackListItem
