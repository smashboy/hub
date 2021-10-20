import { FeedbackStatus } from "db"
import { Droppable, DroppableProvided } from "react-beautiful-dnd"
import { Grid, Paper, Typography, Chip } from "@mui/material"
import { capitalizeString } from "app/core/utils/blitz"
import RoadmapCard from "./RoadmapCard"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import { RoadmapFeedback } from "../helpers"
import { useRoadmap } from "../store/RoadmapContext"

type RoadmapBoardColumnProps = {
  status: FeedbackStatus
  feedback: Array<RoadmapFeedback>
}

const RoadmapBoardColumn: React.FC<RoadmapBoardColumnProps> = ({ status, feedback }) => {
  const isSM = useIsSmallDevice()

  return (
    <Grid
      item
      xs={12}
      sm="auto"
      container
      sx={{ width: isSM ? undefined : `290px!important`, height: "100%" }}
      flexDirection="column"
    >
      <Paper
        variant="outlined"
        sx={{
          paddingY: 0.5,
          minHeight: "calc(100vh - 380px)",
        }}
      >
        <Grid container rowSpacing={1} sx={{ height: "100%" }}>
          <Grid item container xs={12} sx={{ paddingX: 1 }}>
            <Grid item xs={9}>
              <Typography variant="h6" component="div" color="text.primary">
                {capitalizeString(status).replace("_", " ")}
              </Typography>
            </Grid>
            <Grid container item xs={3} justifyContent="flex-end" alignItems="center">
              <Chip label={feedback.length} color="primary" size="small" />
            </Grid>
          </Grid>
          <Droppable droppableId={status}>
            {(provided: DroppableProvided) => (
              <Grid
                item
                container
                rowSpacing={1}
                xs={12}
                sx={{
                  minHeight: "calc(100% - 40px)",
                  height: "100%",
                  paddingBottom: 10,
                  // bgcolor: "red",
                  paddingX: 1,
                  marginTop: 0.25,
                }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {feedback.map((card, index) => (
                  <RoadmapCard key={card.id} feedback={card} index={index} />
                ))}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default RoadmapBoardColumn
