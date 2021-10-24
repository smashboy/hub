import { Suspense } from "react"
import { useQuery } from "blitz"
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Grid,
  Typography,
  Rating,
  List,
} from "@mui/material"
import Dialog from "app/core/components/Dialog"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import getChangelogFeedback from "../queries/getChangelogFeedback"
import ChangelogFeedbackItem from "./ChangelogFeedbackItem"
import { RatingIconContainer } from "./RatingIconContainer"

type ChangelogFeedbackDialogProps = {
  open: boolean
  onClose: () => void
  changelogId: number
  projectSlug: string
}

const Content: React.FC<Pick<ChangelogFeedbackDialogProps, "changelogId" | "projectSlug">> = ({
  changelogId,
  projectSlug,
}) => {
  const [feedback] = useQuery(
    getChangelogFeedback,
    {
      changelogId,
      projectSlug,
    },
    {
      refetchOnWindowFocus: false,
    }
  )

  const avgRating =
    feedback.reduce((prev, current) => prev + current.rating, 0) / feedback.length || 0

  return (
    <Grid container columnSpacing={2}>
      <Grid container item xs={12} justifyContent="center">
        <Typography variant="overline" component="div" color="text.primary">
          Average rating: {avgRating.toFixed(1)}
        </Typography>
      </Grid>
      <Grid container item xs={12} justifyContent="center">
        <Rating
          value={Math.floor(avgRating)}
          IconContainerComponent={RatingIconContainer}
          readOnly
        />
      </Grid>
      <Grid item xs={12}>
        <List component="div">
          {feedback.map(({ id, ...item }) => (
            <ChangelogFeedbackItem key={id} feedback={item} />
          ))}
        </List>
      </Grid>
    </Grid>
  )
}

const ChangelogFeedbackDialog: React.FC<ChangelogFeedbackDialogProps> = ({
  open,
  onClose,
  ...otherProps
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Changelog feedback</DialogTitle>
      <DialogContent>
        <Suspense fallback={<LoadingAnimation />}>
          <Content {...otherProps} />
        </Suspense>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangelogFeedbackDialog
