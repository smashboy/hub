import { FeedbackStatus } from "db"
import { DragDropContext } from "react-beautiful-dnd"
import { Grid, NoSsr, Container } from "@mui/material"
import RoadmapBoardColumn from "./RoadmapBoardColumn"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import { useRoadmap } from "../store/RoadmapContext"
import RoadmapFeedbackDialog from "./RoadmapFeedbackDialog"

const RoadmapBoard = () => {
  const isSM = useIsSmallDevice()

  const { feedback, setFeedback } = useRoadmap()

  return (
    <NoSsr>
      <Container maxWidth="xl">
        <DragDropContext onDragEnd={setFeedback}>
          {/* @ts-ignore */}
          <Grid
            container
            item
            xs={12}
            spacing={2}
            sx={{
              overflow: "auto",
              position: "relative",
              height: "calc(100vh - 235px)",
            }}
            flexWrap={isSM ? undefined : "nowrap"}
          >
            <RoadmapBoardColumn
              status={FeedbackStatus.PENDING}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.PENDING)}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.CANCELED}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.CANCELED)}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.BLOCKED}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.BLOCKED)}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.ON_REVIEW}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.ON_REVIEW)}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.IN_PROGRESS}
              feedback={feedback.filter(
                (card) => card.content.status === FeedbackStatus.IN_PROGRESS
              )}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.COMPLETED}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.COMPLETED)}
            />
          </Grid>
        </DragDropContext>
      </Container>
      <RoadmapFeedbackDialog />
    </NoSsr>
  )
}

export default RoadmapBoard
