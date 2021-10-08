import { Grid, Fade } from "@mui/material"
import MarkdownEditor from "app/core/markdown/Editor"
import { useFeedbackEditor } from "app/project/store/FeedbackEditorContext"

const FeedbackEditor = () => {
  const { disableSubmit, submit } = useFeedbackEditor()

  return (
    <Fade in timeout={750}>
      <Grid item xs={12}>
        <MarkdownEditor
          submitText="Submit feedback"
          onSubmit={submit}
          disableSubmit={disableSubmit}
        />
      </Grid>
    </Fade>
  )
}

export default FeedbackEditor
