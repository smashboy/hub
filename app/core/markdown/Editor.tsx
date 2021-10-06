import { useState, useMemo } from "react"
import { dynamic } from "blitz"
import { createEditor, Descendant } from "slate"
import { withReact } from "slate-react"
import type { Slate as SlateType } from "slate-react"
import { Grid } from "@mui/material"
import Toolbar from "./components/Toolbar"
import Editor from "./components/Editor"
import { EditorProvider } from "./EditorContext"
import { withLinks } from "./utils"

const Slate = dynamic(() => import("slate-react").then((mod) => mod.Slate), {
  ssr: false,
}) as unknown as typeof SlateType

const MarkdownEditor = () => {
  // @ts-ignore
  const editor = useMemo(() => withLinks(withReact(createEditor())), [])

  const [content, setContent] = useState<Descendant[]>([
    {
      type: "heading",
      level: 6,
      children: [{ text: "Here is a heading!" }],
    },
  ])

  return (
    <EditorProvider>
      <Slate value={content} onChange={setContent} editor={editor}>
        <Grid container spacing={2}>
          <Toolbar />
          <Editor />
        </Grid>
      </Slate>
    </EditorProvider>
  )
}

export default MarkdownEditor
