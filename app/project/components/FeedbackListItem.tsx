import { FeedbackCategory, ProjectMemberRole } from "db"
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
} from "@mui/material"
import { formatRelative } from "date-fns"

type FeedbackListItemProps = {
  slug: string
  role?: ProjectMemberRole | null
  feedback: {
    id: number
    title: string
    category: FeedbackCategory
    createdAt: Date
    author: {
      username: string
    }
    _count: {
      upvotedBy: number
    } | null
    labels: {
      id: string
      name: string
      color: string
    }[]
  }
}

const FeedbackListItem: React.FC<FeedbackListItemProps> = ({
  slug,
  role,
  feedback: {
    title,
    id,
    createdAt,
    labels,
    _count,
    author: { username },
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
                  {role && (
                    <Grid container item xs={12} spacing={1}>
                      {labels.map(({ id, name, color }) => (
                        <Grid key={id} item xs="auto">
                          <Chip label={name} key={name} sx={{ bgcolor: color }} size="small" />
                        </Grid>
                      ))}
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
