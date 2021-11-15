import { FeedbackCategory, FeedbackStatus, ProjectMemberRole } from "db"
import { createContext, useContext, useState, useMemo } from "react"
import { DropResult } from "react-beautiful-dnd"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { RoadmapFeedback, RoadmapPageProps } from "../helpers"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import updateFeedbackStatus from "../mutations/updateFeedbackStatus"
import { countProgress } from "app/core/utils/blitz"
import filterRoadmapFeedback from "../mutations/filterRoadmapFeedback"
import { useProject } from "./ProjectContext"

type RoadmapStoreProps = Pick<RoadmapPageProps, "roadmap">

type InfoState = {
  id: number
  slug: string
  name: string
  description: string | null
  dueTo: Date | null
  progress: number
}

type RoadmapStore = {
  info: InfoState
  feedback: RoadmapFeedback[]
  canManage: boolean
  isUpdatingFeedback: boolean
  selectedFeedback: RoadmapFeedback | null
  setInfo: (info: Partial<InfoState>) => void
  onDragEnd: (res: DropResult) => void
  openFeedbackDialog: (feedback: RoadmapFeedback) => void
  filterRoadmap: (category: FeedbackCategory | null) => void
  updateUpvoteCounter: (feedbackId: number, userId: number) => void
  closeFeedbackDialog: () => void
}

const RoadmapContext = createContext<RoadmapStore | null>(null)

export const RoadmapProvider: React.FC<RoadmapStoreProps> = ({
  roadmap: { feedback: initialFeedback, ...roadmap },
  children,
}) => {
  const {
    project: { slug, role },
  } = useProject()

  const user = useCurrentUser(false)

  const [filterRoadmapFeedbackMutation] = useCustomMutation(filterRoadmapFeedback, {})

  const [updateFeedbackStatusMutation, { isLoading: isUpdatingFeedback }] = useCustomMutation(
    updateFeedbackStatus,
    {}
  )

  const [info, setInfo] = useState<InfoState>(roadmap)
  const [selectedFeedback, setSelectedFeedback] = useState<RoadmapFeedback | null>(null)
  const [feedback, setFeedback] = useState(initialFeedback)

  const canManage = useMemo(
    () =>
      Boolean(
        user &&
          (role === ProjectMemberRole.FOUNDER ||
            role === ProjectMemberRole.ADMIN ||
            role === ProjectMemberRole.MODERATOR)
      ),
    [user, role]
  )

  const handleOpenFeedbackDialog = (feedback: RoadmapFeedback) => setSelectedFeedback(feedback)
  const handleCloseFeedbackDialog = () => setSelectedFeedback(null)

  const handleSetInfo = (newInfo: InfoState) =>
    setInfo((prevState) => ({ ...prevState, ...newInfo }))

  const handleOnDragEnd = async (res: DropResult) => {
    const prevFeedback = feedback
    const prevProgress = info.progress
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

      const totalCount = updatedFeedback.length

      const closedFeedbackCount = updatedFeedback.filter(
        ({ content: { status } }) =>
          status === FeedbackStatus.BLOCKED ||
          status === FeedbackStatus.CANCELED ||
          status === FeedbackStatus.COMPLETED
      ).length

      const progress = countProgress(totalCount, closedFeedbackCount)

      setFeedback(updatedFeedback)
      setInfo((prevState) => ({ ...prevState, progress }))

      await updateFeedbackStatusMutation({
        feedbackId,
        projectSlug: slug,
        status: newStatus,
      })
    } catch (error) {
      setFeedback(prevFeedback)
      setInfo((prevState) => ({ ...prevState, progress: prevProgress }))
    }
  }

  const handleUpdateUpvoteCounter = (feedbackId: number, userId: number) => {
    let updatedFeedback = feedback
      .map((card) => {
        if (card.id === feedbackId) {
          const { upvotedBy, ...otherProps } = card

          if (upvotedBy.includes(userId))
            return { ...otherProps, upvotedBy: upvotedBy.filter((id) => userId !== id) }
          return { ...otherProps, upvotedBy: [...upvotedBy, userId] }
        }
        return card
      })
      .sort((a, b) => b.upvotedBy.length - a.upvotedBy.length)

    setFeedback(updatedFeedback)
  }

  const handleFilterRoadmap = async (category: FeedbackCategory | null) => {
    const updatedFeedback = await filterRoadmapFeedbackMutation({
      roadmapId: info.id,
      category,
    })
    setFeedback(updatedFeedback!)
  }

  return (
    <RoadmapContext.Provider
      value={{
        info,
        feedback,
        canManage,
        isUpdatingFeedback,
        selectedFeedback,
        setInfo: handleSetInfo,
        onDragEnd: handleOnDragEnd,
        filterRoadmap: handleFilterRoadmap,
        openFeedbackDialog: handleOpenFeedbackDialog,
        closeFeedbackDialog: handleCloseFeedbackDialog,
        updateUpvoteCounter: handleUpdateUpvoteCounter,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  )
}

export const useRoadmap = () => {
  const store = useContext(RoadmapContext)

  if (!store) throw new Error("useRoadmap must be used within RoadmapProvider")

  return store
}
