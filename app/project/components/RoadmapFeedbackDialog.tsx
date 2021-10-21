import { Routes, useQuery } from "blitz"
import { useState, Suspense, useEffect } from "react"
import { formatRelative } from "date-fns"
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Chip,
  Divider,
  Typography,
} from "@mui/material"
import OpenIcon from "@mui/icons-material/OpenInNew"
import UpvoteIcon from "@mui/icons-material/ArrowDropUp"
import Dialog from "app/core/components/Dialog"
import { useRoadmap } from "../store/RoadmapContext"
import { LoadingButton } from "@mui/lab"
import { ButtonRouteLink } from "app/core/components/links"
import Editor from "app/core/markdown/Editor"
import getFeedbackContent from "../queries/getFeedbackContent"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import upvoteFeedback from "../mutations/upvoteFeedback"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import LoadingAnimation from "app/core/components/LoadingAnimation"

const Content: React.FC<{ projectSlug: string; feedbackId: number }> = ({
  projectSlug,
  feedbackId,
}) => {
  const [content] = useQuery(getFeedbackContent, {
    projectSlug,
    feedbackId,
  })

  return <Editor initialContent={JSON.parse(content)?.content || undefined} readOnly />
}

const RoadmapFeedbackDialog = ({}) => {
  const user = useCurrentUser(false)
  const isSM = useIsSmallDevice()

  const [upvoteFeedbackMutation, { isLoading }] = useCustomMutation(upvoteFeedback, {})

  const { selectedFeedback, closeFeedbackDialog, projectSlug, updateUpvoteCounter } = useRoadmap()

  const [upvotedByUser, setUpvotedByUser] = useState(false)
  const [upvotedCounter, setUpvotedCounter] = useState(0)

  useEffect(() => {
    if (selectedFeedback?.upvotedBy.includes(user?.id as number)) return setUpvotedByUser(true)
    setUpvotedByUser(false)
  }, [user, selectedFeedback])

  useEffect(() => {
    setUpvotedCounter(selectedFeedback?.upvotedBy.length || 0)
  }, [selectedFeedback])

  if (!selectedFeedback) return null

  const {
    createdAt,
    id,
    content: { title, category, status, id: contentId },
    author: { username },
  } = selectedFeedback

  const handleUpvote = async () => {
    await upvoteFeedbackMutation({
      feedbackId: id,
    })

    updateUpvoteCounter(id, user!.id)

    if (upvotedByUser) {
      setUpvotedByUser(false)
      setUpvotedCounter((prevState) => prevState - 1)
      return
    }

    setUpvotedByUser(true)
    setUpvotedCounter((prevState) => prevState + 1)
  }

  return (
    <Dialog open={Boolean(selectedFeedback)} onClose={closeFeedbackDialog}>
      <DialogTitle sx={{ paddingBottom: 0 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5" color="text.primary">
              {title}
            </Typography>
          </Grid>
          <Grid item container spacing={1} xs={8} alignItems="center">
            <Grid item xs="auto">
              <Chip label={category} size="small" />
            </Grid>
            <Grid item xs="auto">
              <Chip label={status.replace("_", " ")} size="small" />
            </Grid>
            <Grid item xs="auto">
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >{`#${contentId} opened ${formatRelative(
                createdAt,
                new Date()
              )} by ${username}`}</Typography>
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            md={4}
            spacing={1}
            justifyContent={isSM ? undefined : "flex-end"}
          >
            <Grid item xs={6} md="auto">
              <ButtonRouteLink
                variant="contained"
                color="inherit"
                fullWidth={isSM}
                href={Routes.SelectedFeedbackPage({ slug: projectSlug, id: contentId })}
              >
                <OpenIcon />
              </ButtonRouteLink>
            </Grid>
            {user && (
              <Grid item xs={6} md="auto">
                <LoadingButton
                  onClick={handleUpvote}
                  variant="contained"
                  color="primary"
                  endIcon={<UpvoteIcon />}
                  fullWidth={isSM}
                  loading={isLoading}
                >
                  {upvotedCounter}
                </LoadingButton>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Suspense fallback={<LoadingAnimation />}>
          <Content projectSlug={projectSlug} feedbackId={contentId} />
        </Suspense>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeFeedbackDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoadmapFeedbackDialog
