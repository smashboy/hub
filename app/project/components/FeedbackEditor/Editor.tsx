import { Grid, Fade } from "@mui/material"
import MarkdownEditor from "app/core/markdown/Editor"

const FeedbackEditor = () => {
  return (
    <Fade in timeout={750}>
      <Grid item xs={12}>
        <MarkdownEditor submitText="Submit feedback" />
      </Grid>
    </Fade>
  )
}

export default FeedbackEditor
