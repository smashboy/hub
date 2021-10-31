import { FeedbackCategory } from "db"
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { Routes, useRouter } from "blitz"
import { useDebouncedCallback } from "use-debounce"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import { Descendant } from "slate"
import createFeedback from "../mutations/createFeedback"
import { FeedbackPageProps } from "../helpers"
import updateFeedback from "../mutations/updateFeedback"
import updateFeedbackParticipants from "../mutations/updateFeedbackParticipants"
import updateFeedbackLabels from "../mutations/updateFeedbackLabels"
import updateFeedbackRoadmaps from "../mutations/updateFeedbackRoadmaps"

export type CategoryType = FeedbackCategory | "none"

export type FeedbackEditorProps = {
  slug: string
  initialValues?: Omit<FeedbackPageProps, "project">
  // readOnly?: boolean
}

export type FeedbackEditorStore = {
  title: string
  category: CategoryType
  slug: string
  memberIds: number[]
  labelIds: string[]
  roadmapIds: number[]
  disableSubmit: boolean
  initialContent?: Descendant[]
  initialValues?: Omit<FeedbackPageProps, "project">
  readOnly: boolean
  setTitle: (newTitle: string) => void
  setCategory: (newCategory: CategoryType) => void
  setMembers: (members: number[]) => void
  setLabels: (labels: string[]) => void
  setRoadmaps: (ids: number[]) => void
  setReadOnly: (newValue: boolean) => void
  submit: (content: Descendant[]) => void
  onReset: () => void
}

const FeedbackEditorContext = createContext<FeedbackEditorStore | null>(null)

export const FeedbackEditorProvider: React.FC<FeedbackEditorProps> = ({
  children,
  slug,
  initialValues,
}) => {
  const router = useRouter()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialContent = useMemo(
    // @ts-ignore
    () => JSON.parse(initialValues?.feedback.content || null) as { content: Descendant[] } | null,
    []
  )

  const [createFeedbackMutation] = useCustomMutation(createFeedback, {
    successNotification: "Thank you for your feedback!",
  })

  const [updateFeedbackMutation] = useCustomMutation(updateFeedback, {
    successNotification: "Feedback has been updated successfully!",
  })

  const [updateFeedbackLabelsMutation] = useCustomMutation(updateFeedbackLabels, {})
  const [updateFeedbackRoadmapsMutation] = useCustomMutation(updateFeedbackRoadmaps, {})
  const [updateFeedbackParticipantsMutation] = useCustomMutation(updateFeedbackParticipants, {})

  const feedback = initialValues?.feedback

  const [title, setTitle] = useState(feedback?.title || "")
  const [category, setCategory] = useState<CategoryType>(feedback?.category || "none")
  const [memberIds, setMembers] = useState<number[]>(
    initialValues?.feedback.participants.map(({ id }) => id) || []
  )
  const [labelIds, setLabelIds] = useState<string[]>(
    initialValues?.feedback.labels.map(({ id }) => id) || []
  )
  const [roadmapIds, setRoadmapIds] = useState<number[]>(
    initialValues?.feedback.roadmaps.map(({ id }) => id) || []
  )
  const [readOnly, setReadOnly] = useState(Boolean(initialValues))
  const [disableSubmit, setDisableSubmit] = useState(false)

  useEffect(() => {
    if (!title || category === "none") return setDisableSubmit(true)
    setDisableSubmit(false)
  }, [title, category, memberIds])

  const handleUpdateParticipants = useDebouncedCallback(async (members: number[]) => {
    if (initialValues) {
      await updateFeedbackParticipantsMutation({
        feedbackId: initialValues.feedback.id,
        participants: members,
        projectSlug: slug,
      })
    }
  }, 2000)

  const handleUpdateLabels = useDebouncedCallback(async (labels: string[]) => {
    if (initialValues) {
      await updateFeedbackLabelsMutation({
        feedbackId: initialValues.feedback.id,
        labels,
        projectSlug: slug,
      })
    }
  }, 2000)

  const handleUpdateRoadmaps = useDebouncedCallback(async (roadmaps: number[]) => {
    if (initialValues) {
      await updateFeedbackRoadmapsMutation({
        feedbackId: initialValues.feedback.id,
        roadmaps,
        projectSlug: slug,
      })
    }
  }, 2000)

  const handleSetTitle = (newTitle: string) => setTitle(newTitle)
  const handleSetCategory = (newCategory: CategoryType) => setCategory(newCategory)
  const handleSetMemberIds = async (members: number[]) => {
    await handleUpdateParticipants(members)
    setMembers(members)
  }
  const handleSetRoadmapIds = async (ids: number[]) => {
    await handleUpdateRoadmaps(ids)
    setRoadmapIds(ids)
  }
  const handleSetLabelIds = async (labels: string[]) => {
    await handleUpdateLabels(labels)
    setLabelIds(labels)
  }
  const handleSetReadOnly = (newValue: boolean) => setReadOnly(newValue)

  const handleSubmit = async (content: Descendant[]) => {
    if (initialValues) {
      await updateFeedbackMutation({
        feedbackId: initialValues.feedback.id,
        title,
        category: category as FeedbackCategory,
        content: JSON.stringify({ content }),
      })

      setReadOnly(true)

      return
    }

    const id = await createFeedbackMutation({
      projectSlug: slug,
      title,
      category: category as FeedbackCategory,
      content: JSON.stringify({ content }),
      participants: memberIds,
      labels: labelIds,
      roadmaps: roadmapIds,
    })
    router.push(Routes.SelectedFeedbackPage({ slug, id }))
  }

  const handleReset = () => {
    setReadOnly(true)
    setTitle(feedback!.title)
    setCategory(feedback!.category)
  }

  return (
    <FeedbackEditorContext.Provider
      value={{
        slug,
        title,
        category,
        memberIds,
        labelIds,
        roadmapIds,
        disableSubmit,
        readOnly,
        initialValues: { feedback: feedback! },
        initialContent: initialContent?.content || undefined,
        setTitle: handleSetTitle,
        setCategory: handleSetCategory,
        setMembers: handleSetMemberIds,
        setLabels: handleSetLabelIds,
        setRoadmaps: handleSetRoadmapIds,
        submit: handleSubmit,
        setReadOnly: handleSetReadOnly,
        onReset: handleReset,
      }}
    >
      {children}
    </FeedbackEditorContext.Provider>
  )
}

export const useFeedbackEditor = () => {
  const store = useContext(FeedbackEditorContext)

  if (!store) throw new Error("useFeedbackEditor must be used within FeedbackEditorProvider")

  return store
}
