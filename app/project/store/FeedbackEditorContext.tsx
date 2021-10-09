import { FeedbackCategory } from "db"
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { Routes, useRouter } from "blitz"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import { Descendant } from "slate"
import createFeedback from "../mutations/createFeedback"
import { FeedbackPageProps } from "../helpers"

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
  setMemberIds: (members: number[]) => void
  setLabels: (labels: string[]) => void
  setReadOnly: (newValue: boolean) => void
  submit: (content: Descendant[]) => void
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

  const feedback = initialValues?.feedback

  const [title, setTitle] = useState(feedback?.title || "")
  const [category, setCategory] = useState<CategoryType>(feedback?.category || "none")
  const [memberIds, setMemberIds] = useState<number[]>([])
  const [labelIds, setLabelIds] = useState<string[]>([])
  const [roadmapIds, setRoadmapIds] = useState<number[]>([])

  const [readOnly, setReadOnly] = useState(Boolean(initialValues))
  const [disableSubmit, setDisableSubmit] = useState(false)

  useEffect(() => {
    if (!title || category === "none") return setDisableSubmit(true)
    setDisableSubmit(false)
  }, [title, category, memberIds])

  const handleSetTitle = (newTitle: string) => setTitle(newTitle)
  const handleSetCategory = (newCategory: CategoryType) => setCategory(newCategory)
  const handleSetMemberIds = (members: number[]) => setMemberIds(members)
  const handleSetLabelIds = (labels: string[]) => setLabelIds(labels)
  const handleSetReadOnly = (newValue: boolean) => setReadOnly(newValue)

  const handleSubmit = async (content: Descendant[]) => {
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
        setMemberIds: handleSetMemberIds,
        setLabels: handleSetLabelIds,
        submit: handleSubmit,
        setReadOnly: handleSetReadOnly,
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
