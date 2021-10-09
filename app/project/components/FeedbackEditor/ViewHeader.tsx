import { Grid, Fade, Typography, Chip, Button, Divider } from "@mui/material"
import { formatRelative } from "date-fns"
import { useFeedbackEditor } from "app/project/store/FeedbackEditorContext"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const FeedbackViewHeader = () => {
  const user = useCurrentUser(false)

  const { title, category, initialValues, setReadOnly } = useFeedbackEditor()

  return (
    <Fade in timeout={500}>
      <Grid container item xs={12} sx={{ height: "fit-content" }}>
        <Grid container item xs={10} spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5" color="text.primary">
              {title}
            </Typography>
          </Grid>
          <Grid container item xs={12} spacing={1} alignItems="center">
            <Grid item xs="auto">
              <Chip label={category} size="small" />
            </Grid>
            <Grid item xs="auto">
              <Typography variant="subtitle2" color="text.secondary">{`#${
                initialValues!.feedback.id
              } opened ${formatRelative(initialValues!.feedback.createdAt, new Date())} by ${
                initialValues!.feedback.author.username
              }`}</Typography>
            </Grid>
          </Grid>
        </Grid>
        {user?.id === initialValues!.feedback.author.id && (
          <Grid container item xs={2} alignItems="center">
            <Button onClick={() => setReadOnly(false)} variant="contained" fullWidth>
              Edit
            </Button>
          </Grid>
        )}
        <Grid item xs={12}>
          <Divider sx={{ marginTop: 1 }} />
        </Grid>
      </Grid>
    </Fade>
  )
}

export default FeedbackViewHeader
