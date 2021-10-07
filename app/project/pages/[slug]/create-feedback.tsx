import { FeedbackType } from "db"
import { Suspense } from "react"
import { BlitzPage, useQuery } from "blitz"
import { Container, Grid, TextField, MenuItem, Hidden, Fade } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { authConfig } from "app/core/configs/authConfig"
import { getProjectInfo, ProjectPageProps } from "../../common"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import MarkdownEditor from "app/core/markdown/Editor"
import getAbility from "app/guard/queries/getAbility"
import FeedbackSidebar from "app/project/components/FeedbackSidebar"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"

type FeedbackSelectOption = { label: string; value: FeedbackType }

const feedbackOptions: FeedbackSelectOption[] = [
  {
    label: "Feature",
    value: FeedbackType.FEATURE,
  },
  {
    label: "Improvement",
    value: FeedbackType.IMPROVEMENT,
  },
  {
    label: "Bug",
    value: FeedbackType.BUG,
  },
]

const CreateFeedbackPage: BlitzPage<ProjectPageProps> = ({
  project: { slug },
}: ProjectPageProps) => {
  const isSM = useIsSmallDevice()

  const [res] = useQuery(getAbility, [["manage", "feedback-settings", slug]], {
    suspense: false,
  })

  const canManageSettings = (res && res[0]?.can) || false

  return (
    <Container maxWidth="lg" disableGutters sx={{ marginTop: 3 }}>
      <Grid container spacing={2}>
        <Grid container spacing={2} item xs={canManageSettings && !isSM ? 9 : 12}>
          <Fade in timeout={500}>
            <Grid container item spacing={2} xs={12}>
              <Grid item xs={12}>
                <TextField label="Title" size="small" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Category" size="small" fullWidth select>
                  {feedbackOptions.map(({ label, value }) => (
                    <MenuItem key={label} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Fade>
          <Fade in timeout={750}>
            <Grid item xs={12}>
              <MarkdownEditor />
            </Grid>
          </Fade>
        </Grid>
        {canManageSettings && (
          <Hidden smDown>
            <Suspense fallback={<div />}>
              <Grid item xs={3}>
                <FeedbackSidebar slug={slug} />
              </Grid>
            </Suspense>
          </Hidden>
        )}
      </Grid>
    </Container>
  )
}

CreateFeedbackPage.authenticate = authConfig

CreateFeedbackPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectMiniLayout title={`${props.project.name} Feedback`} {...props}>
    {page}
  </ProjectMiniLayout>
)

export const getServerSideProps = getProjectInfo

export default CreateFeedbackPage
