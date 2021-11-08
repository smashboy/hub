import { FeedbackCategory, ProjectMemberRole } from "db"
import { useState } from "react"
import { Descendant } from "slate"
import { v4 as uuid } from "uuid"
import { BlitzPage, GetServerSideProps, getSession, useRouter, Routes } from "blitz"
import { Typography, Grid, Fade, useTheme, Container, Switch, TextField } from "@mui/material"
import {
  getProjectInfo,
  getProjectRoadmap,
  RoadmapFeedback,
  RoadmapPageProps,
} from "app/project/helpers"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import Editor from "app/editor/Editor"
import { HeadingElement, ListElement } from "app/editor/types"
import { capitalizeString } from "app/core/utils/blitz"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import createProjectChangelog from "app/project/mutations/createProjectChangelog"
import FileInput from "app/core/components/FileInput"
import superbaseClient from "app/core/superbase/client"
import useNotifications from "app/core/hooks/useNotifications"

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
  roadmap: { name, description, feedback, id: roadmapId },
  project: { slug },
}: RoadmapPageProps) => {
  const router = useRouter()

  const theme = useTheme()

  const { notify } = useNotifications()

  const [createProjectChangelogMutation] = useCustomMutation(createProjectChangelog, {
    successNotification: "Changelog is live!",
  })

  const [title, setTitle] = useState(name)
  const [previewImage, setPreviewImage] = useState<File | null>(null)

  const [readOnly, setReadOnly] = useState(false)

  const handleReadOnly = (event: React.ChangeEvent<HTMLInputElement>) =>
    setReadOnly(event.target.checked)

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)

  const handleSubmit = async (content: Descendant[]) => {
    let previewImageUrl: string | null = null

    if (previewImage) {
      const imagePath = `${uuid()}`

      const bucket = superbaseClient.storage.from("changelog-previews")

      const { error } = await bucket.upload(imagePath, previewImage)

      if (error)
        return notify(error.message, {
          variant: "error",
        })

      const { publicURL, error: publicUrlError } = await bucket.getPublicUrl(imagePath)

      if (publicUrlError)
        return notify(publicUrlError.message, {
          variant: "error",
        })

      previewImageUrl = publicURL
    }

    const changelogSlug = await createProjectChangelogMutation({
      title,
      content: JSON.stringify({ content }),
      previewImageUrl,
      roadmapId,
      projectSlug: slug,
    })

    router.push(Routes.ChangelogPage({ slug, changelogSlug }))
  }

  const handlePreviewImage = (files: File[]) => setPreviewImage(files[0] || null)

  return (
    <Grid container rowSpacing={2} sx={{ marginTop: 1 }}>
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
        <Grid item container xs={12} rowSpacing={2}>
          {!readOnly && (
            <>
              <Grid item xs={12}>
                <TextField
                  value={title}
                  onChange={handleTitle}
                  size="small"
                  label="Changelog name"
                  fullWidth
                />
              </Grid>
              <Grid container item xs={12} rowSpacing={1}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" component="div" color="text.primary">
                    Preview image (optional):
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FileInput
                    label="Drag and drop image or click to upload"
                    maxSize={20}
                    allowedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                    onChange={handlePreviewImage}
                  />
                </Grid>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Container maxWidth="lg" disableGutters>
              <Editor
                initialContent={generateChangelog(description, feedback)}
                readOnly={readOnly}
                bucketId="changelogs"
                disableReset
                cleanVariant
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
  <ProjectMiniLayout
    title={`Create changelog ${props.roadmap.name} | ${props.project.name}`}
    {...props}
  >
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

  if (roadmap.roadmap.progress < 100 || roadmap.roadmap.isArchived)
    return {
      notFound: true,
    }

  return {
    props: { ...project, ...roadmap },
  }
}

export default CreateChangelog
