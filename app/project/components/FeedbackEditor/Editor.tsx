import { Grid, Fade } from "@mui/material"
import Editor from "app/editor/Editor"
import { useFeedbackEditor } from "app/project/store/FeedbackEditorContext"

const FeedbackEditor = () => {
  const { disableSubmit, submit, initialContent, readOnly, initialValues, onReset } =
    useFeedbackEditor()

  return (
    <Fade in timeout={750}>
      <Grid item xs={12}>
        <Editor
          initialContent={initialContent}
          bucketId="feedback"
          submitText="Submit feedback"
          readOnly={readOnly}
          onSubmit={submit}
          disableSubmit={disableSubmit}
          editVariant={Boolean(initialValues?.feedback)}
          onCancel={onReset}
        />
      </Grid>
    </Fade>
  )
}

export default FeedbackEditor
