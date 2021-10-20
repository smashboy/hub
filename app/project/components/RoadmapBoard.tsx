import { useState } from "react"
import { FeedbackStatus } from "db"
import { DragDropContext, DropResult } from "react-beautiful-dnd"
import { Grid, NoSsr, Container } from "@mui/material"
import RoadmapBoardColumn from "./RoadmapBoardColumn"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import { RoadmapFeedback } from "../helpers"
import updateFeedbackStatus from "../mutations/updateFeedbackStatus"
import useCustomMutation from "app/core/hooks/useCustomMutation"

type RoadmapBoardProps = {
  feedback: Array<RoadmapFeedback>
  canManage: boolean
}

const RoadmapBoard: React.FC<RoadmapBoardProps> = ({ feedback: initialFeedback, canManage }) => {
  const isSM = useIsSmallDevice()

  const [updateFeedbackStatusMutation, { isLoading }] = useCustomMutation(updateFeedbackStatus, {})

  const [feedback, setFeedback] = useState(initialFeedback)

  const handleDragEnd = async (res: DropResult) => {
    const prevFeedback = feedback
    try {
      if (!res.destination || res.source.droppableId === res.destination.droppableId) return
      const newStatus = res.destination.droppableId as FeedbackStatus
      const feedbackId = parseInt(res.draggableId)

      const updatedFeedback = prevFeedback.map((card) => {
        if (card.id === feedbackId) {
          const { content, ...otherProps } = card

          return {
            ...otherProps,
            content: {
              ...content,
              status: newStatus,
            },
          }
        }
        return card
      })

      setFeedback(updatedFeedback)

      await updateFeedbackStatusMutation({
        feedbackId,
        status: newStatus,
      })
    } catch (error) {
      setFeedback(prevFeedback)
    }
  }

  return (
    <NoSsr>
      <Container maxWidth="xl" sx={{ paddingTop: 1 }}>
        <DragDropContext onDragEnd={handleDragEnd}>
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
              disableDrag={isLoading || !canManage}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.CANCELED}
              index={0}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.CANCELED)}
              disableDrag={isLoading || !canManage}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.BLOCKED}
              index={0}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.BLOCKED)}
              disableDrag={isLoading || !canManage}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.ON_REVIEW}
              index={0}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.ON_REVIEW)}
              disableDrag={isLoading || !canManage}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.IN_PROGRESS}
              index={0}
              feedback={feedback.filter(
                (card) => card.content.status === FeedbackStatus.IN_PROGRESS
              )}
              disableDrag={isLoading || !canManage}
            />
            <RoadmapBoardColumn
              status={FeedbackStatus.COMPLETED}
              index={0}
              feedback={feedback.filter((card) => card.content.status === FeedbackStatus.COMPLETED)}
              disableDrag={isLoading || !canManage}
            />
          </Grid>
        </DragDropContext>
      </Container>
    </NoSsr>
  )
}

export default RoadmapBoard
