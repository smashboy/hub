import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { Descendant } from "slate"
import { EditorProps, EditorStore } from "./types"

const EditorContext = createContext<EditorStore | null>(null)

export const EditorProvider: React.FC<EditorProps> = ({
  children,
  disableSubmit: disableSubmitProp,
  initialContent,
  submitText,
  editVariant,
  readOnly,
  disablePadding,
  height,
  onSubmit,
  onCancel,
}) => {
  const [content, setContent] = useState<Descendant[]>(
    initialContent || [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ]
  )

  height = height || 350
  disablePadding = disablePadding || false

  const [isFocused, setisFocused] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(disableSubmitProp || false)

  submitText = submitText || "Submit"
  readOnly = readOnly || false
  editVariant = editVariant || false

  useEffect(() => {
    if (disableSubmitProp !== undefined) setDisableSubmit(disableSubmitProp)
  }, [disableSubmitProp])

  useEffect(() => {
    if (initialContent) setContent(initialContent)
  }, [initialContent])

  const handleSetContent = (newContent: Descendant[]) => setContent(newContent)
  const handleResetContent = () => {
    setContent(
      initialContent || [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ]
    )
  }

  const handleSetIsFocused = (newValue: boolean) => setisFocused(newValue)
  const handleSetDisableSubmit = (newValue: boolean) => setDisableSubmit(newValue)

  return (
    <EditorContext.Provider
      value={{
        content,
        isFocused,
        disableSubmit,
        submitText,
        readOnly,
        editVariant,
        height,
        disablePadding,
        setIsFocused: handleSetIsFocused,
        setDisableSubmit: handleSetDisableSubmit,
        setContent: handleSetContent,
        onSubmit,
        onCancel,
        resetContent: handleResetContent,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => {
  const store = useContext(EditorContext)

  if (!store) throw new Error("useEditor must be used within EditorProvider")

  return store
}
