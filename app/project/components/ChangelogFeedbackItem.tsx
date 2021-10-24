import { formatRelative } from "date-fns"
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Grid,
  Rating,
} from "@mui/material"
import { RatingIconContainer } from "./RatingIconContainer"

type ChangelogFeedbackItemProps = {
  feedback: {
    user: {
      username: string
      avatarUrl: string | null
    }
    createdAt: Date
    rating: number
    description: string | null
  }
}

const ChangelogFeedbackItem: React.FC<ChangelogFeedbackItemProps> = ({
  feedback: {
    user: { username, avatarUrl },
    description,
    rating,
    createdAt,
  },
}) => {
  return (
    <ListItem alignItems="flex-start" component="div" divider>
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
                {`${formatRelative(createdAt, new Date())}`}
              </Typography>
            </Grid>
          </Grid>
        }
        secondary={
          <Grid container>
            {description && (
              <Grid item xs={12}>
                {description}
              </Grid>
            )}
            <Grid item xs={12}>
              <Rating
                value={rating}
                highlightSelectedOnly
                readOnly
                IconContainerComponent={(props) => (
                  <RatingIconContainer {...props} fontSize="small" />
                )}
              />
            </Grid>
          </Grid>
        }
      />
    </ListItem>
  )
}

export default ChangelogFeedbackItem
