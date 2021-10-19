import { FeedbackCategory, FeedbackStatus } from "db"
import { DragDropContext } from "react-beautiful-dnd"
import { Grid, NoSsr, Container } from "@mui/material"
import RoadmapBoardColumn from "./RoadmapBoardColumn"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"

type RoadmapBoardProps = {
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

const RoadmapBoard: React.FC<RoadmapBoardProps> = ({ feedback }) => {
  const isSM = useIsSmallDevice()

  return (
    <NoSsr>
      <Container maxWidth="xl" sx={{ paddingTop: 1 }}>
        <DragDropContext>
          {/* @ts-ignore */}
          <Grid
            container
            item
            xs={12}
            spacing={2}
            sx={{ overflowX: isSM ? undefined : "auto!important", paddingBottom: 1 }}
            flexWrap={isSM ? undefined : "nowrap"}
          >
            <RoadmapBoardColumn
              status={FeedbackStatus.PENDING}
              index={0}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.PENDING)}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.CANCELED}
              index={0}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.CANCELED)}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.BLOCKED}
              index={0}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.BLOCKED)}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.ON_REVIEW}
              index={0}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.ON_REVIEW)}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.IN_PROGRESS}
              index={0}
              feedback={feedback.filter(
                (card) => card.content.status === FeedbackStatus.IN_PROGRESS
              )}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.COMPLETED}
              index={0}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.COMPLETED)}
            />
          </Grid>
        </DragDropContext>
      </Container>
    </NoSsr>
  )
}

export default RoadmapBoard
