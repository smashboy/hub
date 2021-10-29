import { useState, useEffect } from "react"
import { Grid, Fade, Typography, Chip, Button, Divider } from "@mui/material"
import UpvoteIcon from "@mui/icons-material/ArrowDropUp"
import { formatRelative } from "date-fns"
import { useFeedbackEditor } from "app/project/store/FeedbackEditorContext"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import upvoteFeedback from "app/project/mutations/upvoteFeedback"
import { LoadingButton } from "@mui/lab"
import useCustomMutation from "app/core/hooks/useCustomMutation"

const FeedbackViewHeader = () => {
  const user = useCurrentUser(false)

  const { title, category, initialValues, setReadOnly } = useFeedbackEditor()
  const [upvotedByUser, setUpvotedByUser] = useState(false)
  const [upvotedCounter, setUpvotedCounter] = useState(initialValues!.feedback.upvotedBy.length)

  const [upvoteFeedbackMutation, { isLoading }] = useCustomMutation(upvoteFeedback, {})

  useEffect(() => {
    if (user) {
      if (initialValues!.feedback.upvotedBy.includes(user.id)) setUpvotedByUser(true)
    }
  }, [user])

  const showEditButton = user?.id === initialValues!.feedback.author.id

  const handleUpvote = async () => {
    await upvoteFeedbackMutation({
      feedbackId: initialValues!.feedback.id,
    })

    if (upvotedByUser) {
      setUpvotedByUser(false)
      setUpvotedCounter((prevState) => prevState - 1)
      return
    }

    setUpvotedByUser(true)
    setUpvotedCounter((prevState) => prevState + 1)
  }

  return (
    <Fade in timeout={500}>
      <Grid container item xs={12} md={12} rowSpacing={1} sx={{ height: "fit-content" }}>
        <Grid container item xs={12} md={8} spacing={1}>
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
              <Chip label={initialValues!.feedback.status.replace("_", " ")} size="small" />
            </Grid>
            <Grid item xs="auto">
              <Typography variant="subtitle2" color="text.secondary">{`#${
                initialValues!.feedback.contentId
              } opened ${formatRelative(initialValues!.feedback.createdAt, new Date())} by ${
                initialValues!.feedback.author.username
              }`}</Typography>
            </Grid>
          </Grid>
        </Grid>

        {(user || showEditButton) && (
          <Grid container item spacing={1} xs={12} md={4} justifyContent="flex-end">
            {user && (
              <Grid container item xs={6} md={3} alignItems="center">
                <LoadingButton
                  onClick={handleUpvote}
                  variant="contained"
                  color="primary"
                  endIcon={<UpvoteIcon />}
                  loading={isLoading}
                  fullWidth
                >
                  {upvotedCounter}
                </LoadingButton>
              </Grid>
            )}
            {showEditButton && (
              <Grid container item xs={6} md={3} alignItems="center">
                <Button
                  onClick={() => setReadOnly(false)}
                  variant="contained"
                  color="secondary"
                  fullWidth
                >
                  Edit
                </Button>
              </Grid>
            )}
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
