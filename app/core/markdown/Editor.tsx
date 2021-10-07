import { Grid } from "@mui/material"
import Toolbar from "./components/Toolbar"
import Editor from "./components/Editor"
import { EditorProvider } from "./EditorContext"
import SlateLayer from "./components/SlateLayer"
import { EditorProps } from "./types"

const MarkdownEditor: React.FC<EditorProps> = (props) => {
  return (
    <EditorProvider {...props}>
      <SlateLayer>
        <Grid container spacing={2}>
          <Toolbar />
          <Editor />
        </Grid>
      </SlateLayer>
    </EditorProvider>
  )
}

export default MarkdownEditor
