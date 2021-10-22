import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { Descendant } from "slate"
import { createEditor } from "slate"
import { withReact } from "slate-react"
import { withHistory } from "slate-history"
import { EditorProps, EditorStore } from "./types"
import { withLinks } from "./utils"

const EditorContext = createContext<EditorStore | null>(null)

export const EditorProvider: React.FC<EditorProps> = ({
  children,
  disableSubmit: disableSubmitProp,
  initialContent,
  submitText,
  updateOnRerender,
  editVariant,
  readOnly,
  disablePadding,
  disableReset,
  height,
  onSubmit,
  onCancel,
}) => {
  // @ts-ignore
  const editor = useMemo(() => withHistory(withLinks(withReact(createEditor()))), [])

  initialContent = useMemo(() => initialContent, [initialContent])

  const [content2Reset, setContent2Reset] = useState<Descendant[] | null>(null)
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
    if (initialContent && updateOnRerender) setContent(initialContent)
  }, [initialContent])

  useEffect(() => {
    if (disableReset) return
    if (!readOnly) return setContent2Reset(content)
    if (readOnly && content2Reset) handleResetContent()
  }, [readOnly])

  useEffect(() => {
    if (disableSubmitProp !== undefined) setDisableSubmit(disableSubmitProp)
  }, [disableSubmitProp])

  const handleSetContent = (newContent: Descendant[]) => setContent(newContent)
  const handleResetContent = () => {
    setContent(
      content2Reset || [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ]
    )
    setContent2Reset(null)

    editor.apply({
      type: "set_selection",
      properties: null,
      newProperties: {
        anchor: {
          offset: 0,
          path: [0, 0],
        },
        focus: {
          offset: 0,
          path: [0, 0],
        },
      },
    })
  }

  const handleSetIsFocused = (newValue: boolean) => setisFocused(newValue)
  const handleSetDisableSubmit = (newValue: boolean) => setDisableSubmit(newValue)

  const handleSubmit = () => {
    onSubmit?.(content)
    setContent2Reset(null)
  }

  const handleCancel = () => {
    handleResetContent()
    onCancel?.()
  }

  return (
    <EditorContext.Provider
      value={{
        editor,
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
        onSubmit: handleSubmit,
        onCancel: handleCancel,
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
