import { FeedbackType } from "db"
import React, { createContext, useContext, useState } from "react"

export type FeedbackEditorStore = {
  title: string
  category: FeedbackType | null
  slug: string
  memberIds: number[]
  labelIds: string[]
  roadmapIds: number[]
}

const FeedbackEditorContext = createContext<FeedbackEditorStore | null>(null)

export const FeedbackEditorProvider: React.FC<{ slug: string }> = ({ children, slug }) => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<FeedbackType | null>(null)
  const [memberIds, setMemberIds] = useState<number[]>([])
  const [labelIds, setLabelIds] = useState<string[]>([])
  const [roadmapIds, setRoadmapIds] = useState<number[]>([])

  return (
    <FeedbackEditorContext.Provider
      value={{ slug, title, category, memberIds, labelIds, roadmapIds }}
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
