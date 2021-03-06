import UpvoteIcon from "@mui/icons-material/ArrowDropUp"
import { Draggable, DraggableProvided } from "react-beautiful-dnd"
import { Card, CardContent, Typography, Grid, Chip, Box } from "@mui/material"
import { formatRelative } from "date-fns"
import { RoadmapFeedback } from "../helpers"
import { useRoadmap } from "../store/RoadmapContext"
import { useProject } from "../store/ProjectContext"

type RoadmapCardProps = {
  index: number
  feedback: RoadmapFeedback
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ feedback, index }) => {
  const {
    project: { role },
  } = useProject()

  const { isUpdatingFeedback, canManage, openFeedbackDialog } = useRoadmap()

  const {
    id,
    content: { title, id: contentId, category },
    author: { username },
    labels,
    upvotedBy,
    createdAt,
  } = feedback

  return (
    <Draggable
      draggableId={`${id}`}
      index={index}
      isDragDisabled={isUpdatingFeedback || !canManage}
    >
      {(dragProvided: DraggableProvided) => (
        <Box paddingTop={1}>
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
                    <Typography
                      variant="h6"
                      component="div"
                      color="text.primary"
                      onClick={() => openFeedbackDialog(feedback)}
                      sx={{ cursor: "pointer" }}
                    >
                      {title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" component="div" color="text.secondary">
                      {`#${contentId} opened ${formatRelative(
                        createdAt,
                        new Date()
                      )} by ${username}`}
                    </Typography>
                  </Grid>
                  <Grid container item xs={12}>
                    <Chip label={category} size="small" />
                  </Grid>
                  {role && (
                    <Grid container item xs={12} spacing={1}>
                      {labels.map(({ name, color }) => (
                        <Grid key={name} item xs="auto">
                          <Chip label={name} key={name} sx={{ bgcolor: color }} size="small" />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </Draggable>
  )
}

export default RoadmapCard
