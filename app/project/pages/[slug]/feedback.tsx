import { FeedbackType } from "db"
import { BlitzPage } from "blitz"
import { Container, Grid, TextField, MenuItem, Hidden } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { authConfig } from "app/core/configs/authConfig"
import { getProjectInfo, ProjectPageProps } from "../../common"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import MarkdownEditor from "app/core/markdown/Editor"

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

const FeedbackPage: BlitzPage = () => {
  return (
    <Container maxWidth="md" disableGutters sx={{ marginTop: 4 }}>
      <Grid container spacing={2}>
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
        <Grid item xs={12}>
          <MarkdownEditor />
        </Grid>
        <Hidden smDown>
          <Grid item xs={12}>
            <LoadingButton variant="contained" fullWidth disabled>
              Send feedback
            </LoadingButton>
          </Grid>
        </Hidden>
      </Grid>
    </Container>
  )
}

FeedbackPage.authenticate = authConfig

FeedbackPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectMiniLayout title={`${props.project.name} Feedback`} {...props}>
    {page}
  </ProjectMiniLayout>
)

export const getServerSideProps = getProjectInfo

export default FeedbackPage
