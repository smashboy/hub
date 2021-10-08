import { FeedbackCategory } from "db"
import { Link, Routes } from "blitz"
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Fade,
  Grid,
  Typography,
  Chip,
  Box,
} from "@mui/material"
import { formatRelative } from "date-fns"

type FeedbackListItemProps = {
  feedback: {
    id: number
    title: string
    category: FeedbackCategory
    createdAt: Date
    author: {
      username: string
    }
    labels: {
      id: string
      name: string
      color: string
    }[]
  }
}

const FeedbackListItem: React.FC<FeedbackListItemProps> = ({
  feedback: {
    title,
    id,
    createdAt,
    labels,
    author: { username },
  },
}) => {
  return (
    <Fade in timeout={500}>
      <Box>
        <ListItem alignItems="flex-start" component="a" button divider>
          <ListItemText
            primary={title}
            secondary={
              <Grid container spacing={1}>
                <Grid item xs={12}>{`#${id} opened ${formatRelative(
                  createdAt,
                  new Date()
                )} by ${username}`}</Grid>
                <Grid container item xs={12} spacing={1}>
                  {labels.map(({ id, name, color }) => (
                    <Grid key={id} item xs="auto">
                      <Chip label={name} key={name} sx={{ bgcolor: color }} size="small" />
                    </Grid>
                  ))}
                </Grid>
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
      </Box>
    </Fade>
  )
}

export default FeedbackListItem
