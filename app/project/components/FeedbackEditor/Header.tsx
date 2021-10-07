import { FeedbackType } from "db"
import { Grid, TextField, MenuItem, Fade } from "@mui/material"

type FeedbackSelectOption = { label: string; value: FeedbackType | "none" }

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

const FeedbackEditorHeader = () => {
  return (
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
  )
}

export default FeedbackEditorHeader
