import { createContext, useContext, useState, useEffect } from "react"
import { Descendant } from "slate"
import { EditorProps, EditorStore } from "./types"

const EditorContext = createContext<EditorStore | null>(null)

export const EditorProvider: React.FC<EditorProps> = ({
  children,
  disableSubmit: disableSubmitProp,
  initialContent,
  submitText,
  onSubmit,
}) => {
  const [content, setContent] = useState<Descendant[]>(
    initialContent || [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ]
  )

  const [isFocused, setisFocused] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(disableSubmitProp || false)

  submitText = submitText || "Submit"

  useEffect(() => {
    if (disableSubmitProp !== undefined) setDisableSubmit(disableSubmitProp)
  }, [disableSubmitProp])

  const handleSetContent = (newContent: Descendant[]) => setContent(newContent)

  const handleSetIsFocused = (newValue: boolean) => setisFocused(newValue)
  const handleSetDisableSubmit = (newValue: boolean) => setDisableSubmit(newValue)

  return (
    <EditorContext.Provider
      value={{
        content,
        isFocused,
        disableSubmit,
        submitText,
        setIsFocused: handleSetIsFocused,
        setDisableSubmit: handleSetDisableSubmit,
        setContent: handleSetContent,
        onSubmit,
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
