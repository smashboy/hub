import { useState } from "react"
import { dynamic } from "blitz"
import { createEditor, Descendant } from "slate"
import { withReact } from "slate-react"
import type { Slate as SlateType, Editable as EditableType } from "slate-react"
import { Grid } from "@mui/material"
import Toolbar from "./components/Toolbar"

// @ts-ignore
const editor = withReact(createEditor())

const Slate = dynamic(() => import("slate-react").then((mod) => mod.Slate), {
  ssr: false,
}) as unknown as typeof SlateType

const MarkdownEditor = () => {
  const [content, setContent] = useState<Descendant[]>([])

  return (
    <Slate value={content} onChange={setContent} editor={editor}>
      <Grid container spacing={1}>
        <Toolbar />
      </Grid>
    </Slate>
  )
}

export default MarkdownEditor
