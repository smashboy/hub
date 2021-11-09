import { FeedbackStatus } from "db"
import { Droppable, DroppableProvided } from "react-beautiful-dnd"
import { Grid, Paper, Typography, Chip, Box } from "@mui/material"
import { capitalizeString } from "app/core/utils/blitz"
import RoadmapCard from "./RoadmapCard"
import { RoadmapFeedback } from "../helpers"

type RoadmapBoardColumnProps = {
  status: FeedbackStatus
  feedback: Array<RoadmapFeedback>
}

const RoadmapBoardColumn: React.FC<RoadmapBoardColumnProps> = ({ status, feedback }) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        width: {
          xs: undefined,
          md: "290px!important",
        },
        flexDirection: "column",
        paddingX: 1,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          paddingY: 0.5,
        }}
      >
        <Grid container rowSpacing={1}>
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
              <Box
                sx={{
                  paddingBottom: 1,
                  // bgcolor: "red",
                  minHeight: 250,
                  paddingX: 1,
                  marginTop: 0.25,
                  height: "calc(100vh - 300px)",
                  // bgcolor: "red",
                  overflowX: "hidden",
                  overflowY: "auto",
                }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {feedback.map((card, index) => (
                  <RoadmapCard key={card.id} feedback={card} index={index} />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </Grid>
      </Paper>
    </Box>
  )
}

export default RoadmapBoardColumn
