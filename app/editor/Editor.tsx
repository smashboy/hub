import { Grid } from "@mui/material"
import Toolbar from "./components/Toolbar"
import EditorContainer from "./components/Editor"
import { EditorProvider } from "./EditorContext"
import SlateLayer from "./components/SlateLayer"
import { EditorProps } from "./types"

const Editor: React.FC<EditorProps> = (props) => {
  return (
    <EditorProvider {...props}>
      <SlateLayer>
        <Grid container spacing={2}>
          <Toolbar />
          <EditorContainer />
        </Grid>
      </SlateLayer>
    </EditorProvider>
  )
}

export default Editor
