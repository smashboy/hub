import { RequestType } from "db"
import { BlitzPage } from "blitz"
import { Container, Grid, TextField, MenuItem } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { authConfig } from "app/core/configs/authConfig"
import { getProjectInfo, ProjectPageProps } from "../../common"
import ProjectMiniLayout from "app/project/layouts/ProjectMiniLayout"
import MarkdownEditor from "app/core/components/MarkdownEditor"

type FeedbackSelectOption = { label: string; value: RequestType }

const feedbackOptions: FeedbackSelectOption[] = [
  {
    label: "Feature",
    value: RequestType.FEATURE,
  },
  {
    label: "Improvement",
    value: RequestType.IMPROVEMENT,
  },
  {
    label: "Bug",
    value: RequestType.BUG,
  },
]

const FeedbackPage: BlitzPage = () => {
  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
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
        <Grid item xs={12}>
          <LoadingButton variant="contained" fullWidth disabled>
            Submit feedback
          </LoadingButton>
        </Grid>
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
