import { createContext, useContext, useState, useEffect, useMemo, useRef } from "react"
import { createEditor, Descendant, Transforms } from "slate"
import { withReact } from "slate-react"
import { withHistory } from "slate-history"
import { EditorProps, EditorStore } from "./types"
import { withImages, withLinks } from "./utils"

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
  closeOnSubmit,
  bucketId,
  cleanVariant,
  onSubmit,
  onCancel,
}) => {
  // @ts-ignore
  const editor = useMemo(() => withImages(withHistory(withLinks(withReact(createEditor())))), [])

  initialContent = useMemo(() => initialContent, [initialContent])

  const content2Reset = useRef<Descendant[] | null>(null)
  const [content, setContent] = useState<Descendant[]>(
    initialContent || [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ]
  )

  height = height ?? 350
  disablePadding = disablePadding ?? false
  cleanVariant = cleanVariant ?? false

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
    if (!readOnly) {
      content2Reset.current = content
      return
    }
    if (readOnly) handleResetContent()
  }, [readOnly])

  useEffect(() => {
    if (disableSubmitProp !== undefined) setDisableSubmit(disableSubmitProp)
  }, [disableSubmitProp])

  const handleSetContent = (newContent: Descendant[]) => setContent(newContent)
  const handleResetContent = () => {
    if (content2Reset.current) {
      editor.children = content2Reset.current
      content2Reset.current = null
    }

    Transforms.select(editor, {
      anchor: {
        offset: 0,
        path: [0, 0],
      },
      focus: {
        offset: 0,
        path: [0, 0],
      },
    })
  }

  const handleSetIsFocused = (newValue: boolean) => setisFocused(newValue)
  const handleSetDisableSubmit = (newValue: boolean) => setDisableSubmit(newValue)

  const handleSubmit = () => {
    onSubmit?.(content)
    content2Reset.current = null

    if (closeOnSubmit) onCancel?.()
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
        bucketId,
        cleanVariant,
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
