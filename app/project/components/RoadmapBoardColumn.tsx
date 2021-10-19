import { FeedbackCategory, FeedbackStatus } from "db"
import { Draggable, Droppable, DroppableProvided } from "react-beautiful-dnd"
import { Grid, Paper, Typography, Chip } from "@mui/material"
import { capitalizeString } from "app/core/utils/blitz"
import RoadmapCard from "./RoadmapCard"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"

type RoadmapBoardColumnProps = {
  status: FeedbackStatus
  index: number
  feedback: Array<{
    author: {
      username: string
    }
    id: number
    labels: Array<{
      name: string
      color: string
    }>
    content: {
      title: string
      category: FeedbackCategory
      status: FeedbackStatus
    }
    upvotedBy: number[]
  }>
}

const RoadmapBoardColumn: React.FC<RoadmapBoardColumnProps> = ({ status, index, feedback }) => {
  const isSM = useIsSmallDevice()

  return (
    <Grid item xs={12} sm="auto" sx={{ width: isSM ? undefined : `290px!important` }}>
      <Paper
        variant="outlined"
        sx={{
          paddingY: 0.5,
          paddingX: 1,
          height: "calc(100vh - 315px)",
          overflowY: "auto",
        }}
      >
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid item xs={9}>
            <Typography variant="h6" component="div" color="text.primary">
              {capitalizeString(status).replace("_", " ")}
            </Typography>
          </Grid>
          <Grid container item xs={3} justifyContent="flex-end" alignItems="center">
            <Chip label={feedback.length} color="primary" size="small" />
          </Grid>
          <Droppable droppableId={status}>
            {(provided: DroppableProvided) => (
              <Grid
                item
                xs={12}
                sx={{ height: "calc(100% - 40px)" }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {feedback.map((card, index) => (
                  <RoadmapCard key={card.id} feedback={card} index={index} />
                ))}
              </Grid>
            )}
          </Droppable>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default RoadmapBoardColumn
