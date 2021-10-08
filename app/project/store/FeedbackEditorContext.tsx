import { FeedbackCategory } from "db"
import React, { createContext, useContext, useState, useEffect } from "react"
import { Routes, useRouter } from "blitz"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import { Descendant } from "slate"
import createFeedback from "../mutations/createFeedback"

export type CategoryType = FeedbackCategory | "none"

export type FeedbackEditorStore = {
  title: string
  category: CategoryType
  slug: string
  memberIds: number[]
  labelIds: string[]
  roadmapIds: number[]
  disableSubmit: boolean
  setTitle: (newTitle: string) => void
  setCategory: (newCategory: CategoryType) => void
  setMemberIds: (members: number[]) => void
  setLabels: (labels: string[]) => void
  submit: (content: Descendant[]) => void
}

const FeedbackEditorContext = createContext<FeedbackEditorStore | null>(null)

export const FeedbackEditorProvider: React.FC<{ slug: string }> = ({ children, slug }) => {
  const router = useRouter()

  const [createFeedbackMutation] = useCustomMutation(createFeedback, {
    successNotification: "Thank you for your feedback!",
  })

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<CategoryType>("none")
  const [memberIds, setMemberIds] = useState<number[]>([])
  const [labelIds, setLabelIds] = useState<string[]>([])
  const [roadmapIds, setRoadmapIds] = useState<number[]>([])

  const [disableSubmit, setDisableSubmit] = useState(false)

  useEffect(() => {
    if (!title || category === "none") return setDisableSubmit(true)
    setDisableSubmit(false)
  }, [title, category, memberIds])

  const handleSetTitle = (newTitle: string) => setTitle(newTitle)
  const handleSetCategory = (newCategory: CategoryType) => setCategory(newCategory)
  const handleSetMemberIds = (members: number[]) => setMemberIds(members)
  const handleSetLabelIds = (labels: string[]) => setLabelIds(labels)

  const handleSubmit = async (content: Descendant[]) => {
    await createFeedbackMutation({
      projectSlug: slug,
      title,
      category: category as FeedbackCategory,
      content: JSON.stringify({ content }),
      participants: memberIds,
      labels: labelIds,
      roadmaps: roadmapIds,
    })
    router.push(Routes.ProjectLandingPage({ slug }))
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
        setTitle: handleSetTitle,
        setCategory: handleSetCategory,
        setMemberIds: handleSetMemberIds,
        setLabels: handleSetLabelIds,
        submit: handleSubmit,
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
