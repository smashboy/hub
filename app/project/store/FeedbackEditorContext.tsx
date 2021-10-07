import { FeedbackType } from "db"
import React, { createContext, useContext, useState } from "react"

export type CategoryType = FeedbackType | "none"

export type FeedbackEditorStore = {
  title: string
  category: CategoryType
  slug: string
  memberIds: number[]
  labelIds: string[]
  roadmapIds: number[]
  setTitle: (newTitle: string) => void
  setCategory: (newCategory: CategoryType) => void
}

const FeedbackEditorContext = createContext<FeedbackEditorStore | null>(null)

export const FeedbackEditorProvider: React.FC<{ slug: string }> = ({ children, slug }) => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<CategoryType>("none")
  const [memberIds, setMemberIds] = useState<number[]>([])
  const [labelIds, setLabelIds] = useState<string[]>([])
  const [roadmapIds, setRoadmapIds] = useState<number[]>([])

  const handleSetTitle = (newTitle: string) => setTitle(newTitle)
  const handleSetCategory = (newCategory: CategoryType) => setCategory(newCategory)

  return (
    <FeedbackEditorContext.Provider
      value={{
        slug,
        title,
        category,
        memberIds,
        labelIds,
        roadmapIds,
        setTitle: handleSetTitle,
        setCategory: handleSetCategory,
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
