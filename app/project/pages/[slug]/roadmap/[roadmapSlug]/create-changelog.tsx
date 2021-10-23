import { FeedbackCategory, ProjectMemberRole } from "db"
import { useState } from "react"
import { Descendant } from "slate"
import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Typography, Grid, Fade, useTheme, Container, Switch, TextField } from "@mui/material"
import {
  getProjectInfo,
  getProjectRoadmap,
  RoadmapFeedback,
  RoadmapPageProps,
} from "app/project/helpers"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import MarkdownEditor from "app/core/markdown/Editor"
import { HeadingElement, ListElement } from "app/core/markdown/types"
import { capitalizeString } from "app/core/utils/blitz"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import createProjectChangelog from "app/project/mutations/createProjectChangelog"

const generateListFromFeedbackArray = (
  category: FeedbackCategory,
  feedback: RoadmapFeedback[]
): Descendant[] => {
  if (feedback.length === 0) return []

  const content: ListElement = {
    type: "bul-list",
    children: feedback.map((f) => ({
      type: "list-item",
      children: [{ text: f.content.title }],
    })),
  }

  const heading: HeadingElement = {
    type: "heading",
    level: 6,
    children: [{ text: `${capitalizeString(category)}s` }],
  }

  return [heading, content] as Descendant[]
}

const generateChangelog = (
  description: string | null,
  feedback: RoadmapFeedback[]
): Descendant[] => {
  const descriptionStaged: Descendant | null = description
    ? {
        type: "paragraph",
        children: [{ text: description }],
      }
    : null

  const features = generateListFromFeedbackArray(
    FeedbackCategory.FEATURE,
    feedback.filter((f) => f.content.category === FeedbackCategory.FEATURE)
  )

  const bugs = generateListFromFeedbackArray(
    FeedbackCategory.BUG,
    feedback.filter((f) => f.content.category === FeedbackCategory.BUG)
  )

  const improvements = generateListFromFeedbackArray(
    FeedbackCategory.IMPROVEMENT,
    feedback.filter((f) => f.content.category === FeedbackCategory.IMPROVEMENT)
  )

  // @ts-ignore
  const changelog = [descriptionStaged, ...features, ...bugs, ...improvements].filter(
    (el) => el !== null
  ) as Descendant[]

  return changelog
}

const CreateChangelog: BlitzPage<RoadmapPageProps> = ({
  roadmap: { name, description, feedback },
  project: { slug },
}: RoadmapPageProps) => {
  const theme = useTheme()

  const [createProjectChangelogMutation] = useCustomMutation(createProjectChangelog, {
    successNotification: "Changelog is live!",
  })

  const [title, setTitle] = useState(name)

  const [readOnly, setReadOnly] = useState(false)

  const handleReadOnly = (event: React.ChangeEvent<HTMLInputElement>) =>
    setReadOnly(event.target.checked)

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)

  const handleSubmit = async (content: Descendant[]) => {
    await createProjectChangelogMutation({
      title,
      content: JSON.stringify({ content }),
      projectSlug: slug,
    })
  }

  return (
    <Grid container spacing={2} sx={{ marginTop: 1 }}>
      <Grid item xs={12}>
        <Fade in timeout={500}>
          <Typography variant="h4" color="text.primary" align="center">
            Create <span style={{ color: theme.palette.primary.main }}>{name}</span> Changelog
          </Typography>
        </Fade>
      </Grid>
      <Fade in timeout={750}>
        <Grid container item xs={12} justifyContent="center">
          <Grid container item xs={12} justifyContent="center">
            <Typography variant="overline" color="text.secondary" align="center">
              Share your progress with others
            </Typography>
          </Grid>
          <Grid item container xs={12} justifyContent="flex-end" alignItems="center">
            <Typography variant="subtitle1" component="div" color="text.primary">
              Preview
            </Typography>
            <Switch checked={readOnly} onChange={handleReadOnly} />
          </Grid>
        </Grid>
      </Fade>
      <Fade in timeout={900}>
        <Grid item container xs={12} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={title}
              onChange={handleTitle}
              size="small"
              label="Changelog name"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Container maxWidth="lg" disableGutters>
              <MarkdownEditor
                initialContent={generateChangelog(description, feedback)}
                readOnly={readOnly}
                disableReset
                onSubmit={handleSubmit}
              />
            </Container>
          </Grid>
        </Grid>
      </Fade>
    </Grid>
  )
}

CreateChangelog.getLayout = (page, props: RoadmapPageProps) => (
  <ProjectMiniLayout title={props.project.name} {...props}>
    {page}
  </ProjectMiniLayout>
)

export const getServerSideProps: GetServerSideProps<RoadmapPageProps> = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession(req, res)
  const slug = (params?.slug as string) || null
  const roadmapSlug = (params?.roadmapSlug as string) || null

  const project = await getProjectInfo(slug, session, [
    ProjectMemberRole.ADMIN,
    ProjectMemberRole.MODERATOR,
    ProjectMemberRole.FOUNDER,
  ])

  if (!project)
    return {
      notFound: true,
    }

  const roadmap = await getProjectRoadmap(slug!, roadmapSlug)

  if (!roadmap)
    return {
      notFound: true,
    }

  if (roadmap.roadmap.progress < 100)
    return {
      notFound: true,
    }

  return {
    props: { ...project, ...roadmap },
  }
}

export default CreateChangelog
