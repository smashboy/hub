import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Grid, Typography, Container, Fade } from "@mui/material"
import { format } from "date-fns"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import { ChangelogPageProps, getChangelog, getProjectInfo } from "app/project/helpers"
import MarkdownEditor from "app/core/markdown/Editor"

const ChangelogPage: BlitzPage<ChangelogPageProps> = ({
  changelog: { title, content, createdAt },
}: ChangelogPageProps) => {
  return (
    <Container maxWidth="md" disableGutters sx={{ marginTop: 3 }}>
      <Grid container spacing={2}>
        <Fade in timeout={350}>
          <Grid container item xs={12} spacing={1}>
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
        <Fade in timeout={750}>
          <Grid item xs={12}>
            <MarkdownEditor initialContent={JSON.parse(content)?.content || undefined} readOnly />
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

  const changelogProps = await getChangelog(projectSlug!, changelogSlug)

  if (!changelogProps)
    return {
      notFound: true,
    }

  return {
    props: { ...projectProps, ...changelogProps },
  }
}

export default ChangelogPage
