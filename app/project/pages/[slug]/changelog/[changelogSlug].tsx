import { useState } from "react"
import { BlitzPage, GetServerSideProps, getSession, useRouter, Routes } from "blitz"
import {
  Grid,
  Typography,
  Container,
  Fade,
  Button,
  Rating,
  TextField,
  IconContainerProps,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { format } from "date-fns"
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied"
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied"
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied"
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined"
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import { ChangelogPageProps, getChangelog, getProjectInfo } from "app/project/helpers"
import MarkdownEditor from "app/core/markdown/Editor"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import updateProjectChangelog from "app/project/mutations/updateProjectChangelog"
import { Descendant } from "slate"
import createChangelogFeedback from "app/project/mutations/createChangelogFeedback"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const customIcons: {
  [index: string]: {
    icon: React.ReactElement
    label: string
  }
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon fontSize="large" />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon fontSize="large" />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon fontSize="large" />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon fontSize="large" />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon fontSize="large" />,
    label: "Very Satisfied",
  },
}

const IconContainer: React.FC<IconContainerProps> = ({ value, ...other }) => (
  <span {...other}>{customIcons[value]!.icon}</span>
)

const ChangelogPage: BlitzPage<ChangelogPageProps> = ({
  changelog: { title, content, createdAt, id, userRating },
  project: { slug, role },
}: ChangelogPageProps) => {
  const user = useCurrentUser(false)

  const router = useRouter()

  const [updateProjectChangelogMutation] = useCustomMutation(updateProjectChangelog, {
    successNotification: "Changelog has been updated successfully!",
  })

  const [createChangelogFeedbackMutation, { isLoading: isLoadingChangelogFeedback }] =
    useCustomMutation(createChangelogFeedback, {
      successNotification: "Thank you for your feedback!",
    })

  const [editMode, setEditMore] = useState(false)
  const [ratingSubmitted, setRatingSubmitted] = useState(userRating !== null)
  const [rating, setRating] = useState<number | null>(userRating)
  const [description, setDescription] = useState("")

  const handleEditChangelog = () => setEditMore(true)
  const handleCancelEditChangelog = () => setEditMore(false)

  const handleRating = (event: React.SyntheticEvent<Element, Event>, newValue: number | null) =>
    setRating(newValue)

  const handleFeedbackDescription = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDescription(event.target.value)

  const handleUpdateChangelog = async (content: Descendant[]) => {
    const newSlug = await updateProjectChangelogMutation({
      changelogId: id,
      projectSlug: slug,
      title,
      content: JSON.stringify({ content }),
    })

    router.push(Routes.ChangelogPage({ slug, changelogSlug: newSlug }), undefined, {
      shallow: true,
    })
  }

  const handleCreateChangelogFeedback = async () => {
    await createChangelogFeedbackMutation({
      changelogId: id,
      rating: rating!,
      description: description || null,
    })

    setRatingSubmitted(true)
  }

  return (
    <Container maxWidth="md" disableGutters sx={{ marginTop: 3 }}>
      <Grid container spacing={2}>
        <Fade in timeout={350}>
          <Grid container item xs={role ? 10 : 12} spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h3" color="text.primary">
                {title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                {format(createdAt, "dd MMMM, yyyy")}
              </Typography>
            </Grid>
          </Grid>
        </Fade>
        {role && !editMode && (
          <Grid item container xs={2} alignItems="center" justifyContent="flex-end">
            <Button variant="contained" onClick={handleEditChangelog}>
              Edit
            </Button>
          </Grid>
        )}
        <Fade in timeout={750}>
          <Grid container item spacing={2}>
            <Grid item xs={12}>
              <MarkdownEditor
                initialContent={JSON.parse(content)?.content || undefined}
                onCancel={handleCancelEditChangelog}
                onSubmit={handleUpdateChangelog}
                editVariant
                closeOnSubmit
                readOnly={!editMode}
              />
            </Grid>
            {user && (
              <Grid container item xs={12} spacing={2} justifyContent="center">
                <Grid container item xs={12} justifyContent="center">
                  <Typography variant="h6" color="text.primary">
                    {ratingSubmitted
                      ? "Thank you for your feedback!"
                      : "Did you like the new changes?"}
                  </Typography>
                </Grid>
                <Grid container item xs={12} justifyContent="center">
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    IconContainerComponent={IconContainer}
                    highlightSelectedOnly
                    onChange={handleRating}
                    readOnly={ratingSubmitted}
                  />
                </Grid>
                <Fade
                  in={Boolean(rating !== null && user && !ratingSubmitted)}
                  timeout={250}
                  unmountOnExit
                >
                  <Grid container item xs={12} md={8} spacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        value={description}
                        onChange={handleFeedbackDescription}
                        multiline
                        rows={3}
                        label="Describe your opinion (optional)"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <LoadingButton
                        onClick={handleCreateChangelogFeedback}
                        variant="contained"
                        fullWidth
                        loading={isLoadingChangelogFeedback}
                      >
                        Submit
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Fade>
              </Grid>
            )}
          </Grid>
        </Fade>
      </Grid>
    </Container>
  )
}

ChangelogPage.getLayout = (page, props: ChangelogPageProps) => (
  <ProjectMiniLayout title={props.project.name} {...props}>
    {page}
  </ProjectMiniLayout>
)

export const getServerSideProps: GetServerSideProps<ChangelogPageProps> = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession(req, res)
  const projectSlug = (params?.slug as string) || null
  const changelogSlug = (params?.changelogSlug as string) || null

  const projectProps = await getProjectInfo(projectSlug, session)

  if (!projectProps)
    return {
      notFound: true,
    }

  const changelogProps = await getChangelog(projectSlug!, session, changelogSlug)

  if (!changelogProps)
    return {
      notFound: true,
    }

  return {
    props: { ...projectProps, ...changelogProps },
  }
}

export default ChangelogPage
