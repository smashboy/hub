import { useState } from "react"
import { dynamic } from "blitz"
import type MdEditorType from "react-markdown-editor-lite"
import type ReactMarkdownType from "react-markdown"
import { Plugins } from "react-markdown-editor-lite"
import MarkdownIt from "markdown-it"
import { Grid, Tab, Tabs } from "@mui/material"
import { useIsSmallDevice } from "../hooks/useIsSmallDevice"
import { createEditor, Descendant, BaseEditor } from "slate"
import type { Slate as SlateType, Editable as EditableType } from "slate-react"
import { withReact } from "slate-react"
import "react-markdown-editor-lite/lib/index.css"

const Slate = dynamic(() => import("slate-react").then((mod) => mod.Slate), {
  ssr: false,
})
const Editable = dynamic(() => import("slate-react").then((mod) => mod.Editable), {
  ssr: false,
})

// @ts-ignore
const editor = withReact(createEditor())

const ReactMarkdown = dynamic(() => import("react-markdown").then((mod) => mod.default), {
  ssr: false,
}) as unknown as typeof ReactMarkdownType

const MdEditor = dynamic(
  () => {
    return new Promise((resolve) => {
      Promise.all([import("react-markdown-editor-lite")]).then((res) => {
        const editor = res[0]!.default
        editor.unuseAll()
        editor.use(Plugins.FontBold)
        editor.use(Plugins.FontItalic)
        editor.use(Plugins.FontStrikethrough)
        editor.use(Plugins.FontUnderline)
        editor.use(Plugins.ListOrdered)
        editor.use(Plugins.ListUnordered)
        editor.use(Plugins.Header)
        editor.use(Plugins.Image)
        editor.use(Plugins.Link)
        editor.use(Plugins.BlockCodeBlock)
        editor.use(Plugins.BlockCodeInline)
        editor.use(Plugins.BlockQuote)
        editor.use(Plugins.BlockWrap)
        editor.use(Plugins.Clear)
        editor.use(Plugins.Logger)
        editor.use(Plugins.Image)
        // @ts-ignore
        resolve(res[0].default)
      })
    })
  },
  {
    ssr: false,
  }
) as unknown as typeof MdEditorType

const mdParser = new MarkdownIt()

type Mode = "editor" | "preview"

const MarkdownEditor = () => {
  const isSM = useIsSmallDevice()

  const [content, setContent] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ])
  const [mode, setMode] = useState<Mode>("editor")

  const handleModeChange = (event: React.SyntheticEvent, newValue: Mode) => setMode(newValue)

  // const handleEditorChange = ({ text }: { text: string }) => setContent(text)

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Tabs value={mode} onChange={handleModeChange} centered={isSM}>
          <Tab value="editor" label="Editor" />
          <Tab value="preview" label="Preview" />
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        <Slate value={content} onChange={setContent} editor={editor}>
          <Editable />
        </Slate>
        {/* {mode === "editor" && (
          <MdEditor
            style={{ height: "350px" }}
            value={content}
            onChange={handleEditorChange}
            view={{
              menu: true,
              md: true,
              html: false,
            }}
            renderHTML={(text) => mdParser.render(text)}
          />
        )}
        {mode === "preview" && <ReactMarkdown components={{}}>{content}</ReactMarkdown>} */}
      </Grid>
    </Grid>
  )
}

export default MarkdownEditor
