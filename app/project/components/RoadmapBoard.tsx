import { FeedbackStatus } from "db"
import { DragDropContext } from "react-beautiful-dnd"
import { NoSsr, Container, Box } from "@mui/material"
import RoadmapBoardColumn from "./RoadmapBoardColumn"
import { useRoadmap } from "../store/RoadmapContext"
import RoadmapFeedbackDialog from "./RoadmapFeedbackDialog"

const RoadmapBoard = () => {
  const { feedback, onDragEnd, info } = useRoadmap()

  return (
    <NoSsr>
      <Container
        maxWidth="xl"
        sx={{
          height: `calc(100vh - ${info.description ? 245 : 225}px)`,
          marginTop: { xs: 0, md: info.description ? "125px" : "95px" },
        }}
      >
        <Box sx={{ display: { xs: "block", md: "inline-flex" } }}>
          <DragDropContext onDragEnd={onDragEnd}>
            {/* @ts-ignore */}
            <Box
              sx={{
                display: { xs: "block", md: "inline-flex" },
                overflow: "hidden",
                flexWrap: {
                  xs: "wrap",
                  md: "nowrap",
                },
              }}
            >
              <RoadmapBoardColumn
                status={FeedbackStatus.PENDING}
                feedback={feedback.filter((card) => card.content.status === FeedbackStatus.PENDING)}
              />
              <RoadmapBoardColumn
                status={FeedbackStatus.ON_REVIEW}
                feedback={feedback.filter(
                  (card) => card.content.status === FeedbackStatus.ON_REVIEW
                )}
              />
              <RoadmapBoardColumn
                status={FeedbackStatus.PLANNED}
                feedback={feedback.filter((card) => card.content.status === FeedbackStatus.PLANNED)}
              />
              <RoadmapBoardColumn
                status={FeedbackStatus.IN_PROGRESS}
                feedback={feedback.filter(
                  (card) => card.content.status === FeedbackStatus.IN_PROGRESS
                )}
              />
              <RoadmapBoardColumn
                status={FeedbackStatus.COMPLETED}
                feedback={feedback.filter(
                  (card) => card.content.status === FeedbackStatus.COMPLETED
                )}
              />
              <RoadmapBoardColumn
                status={FeedbackStatus.CANCELED}
                feedback={feedback.filter(
                  (card) => card.content.status === FeedbackStatus.CANCELED
                )}
              />
              <RoadmapBoardColumn
                status={FeedbackStatus.BLOCKED}
                feedback={feedback.filter((card) => card.content.status === FeedbackStatus.BLOCKED)}
              />
            </Box>
          </DragDropContext>
        </Box>
      </Container>
      <RoadmapFeedbackDialog />
    </NoSsr>
  )
}

export default RoadmapBoard
