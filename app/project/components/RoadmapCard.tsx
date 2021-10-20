import { FeedbackCategory, FeedbackStatus } from "db"
import UpvoteIcon from "@mui/icons-material/ArrowDropUp"
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd"
import { Card, CardContent, CardActionArea, Typography, Grid, Chip } from "@mui/material"
import { formatRelative } from "date-fns"
import { RoadmapFeedback } from "../helpers"

type RoadmapCardProps = {
  index: number
  feedback: RoadmapFeedback
  disableDrag: boolean
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({
  feedback: {
    id,
    content: { title },
    author: { username },
    labels,
    upvotedBy,
    createdAt,
  },
  disableDrag,
  index,
}) => {
  return (
    <Draggable draggableId={`${id}`} index={index} isDragDisabled={disableDrag}>
      {(dragProvided: DraggableProvided) => (
        <Card
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
        >
          <CardContent>
            <Grid container>
              <Grid container item xs={2} alignItems="center">
                <Typography variant="subtitle1" component="div">
                  {upvotedBy.length}
                </Typography>
                <UpvoteIcon />
              </Grid>
              <Grid container item xs={10} spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6" component="div" color="text.primary">
                    {title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" component="div" color="text.secondary">
                    {`#${id} opened ${formatRelative(createdAt, new Date())} by ${username}`}
                  </Typography>
                </Grid>
                <Grid container item xs={12} spacing={1}>
                  {labels.map(({ name, color }) => (
                    <Grid key={name} item xs="auto">
                      <Chip label={name} key={name} sx={{ bgcolor: color }} size="small" />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}

export default RoadmapCard
