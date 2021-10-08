import { FeedbackCategory } from "db"
import { Grid, TextField, MenuItem, Fade } from "@mui/material"
import { CategoryType, useFeedbackEditor } from "app/project/store/FeedbackEditorContext"

type FeedbackSelectOption = { label: string; value: CategoryType }

const feedbackOptions: FeedbackSelectOption[] = [
  {
    label: "Feature",
    value: FeedbackCategory.FEATURE,
  },
  {
    label: "Improvement",
    value: FeedbackCategory.IMPROVEMENT,
  },
  {
    label: "Bug",
    value: FeedbackCategory.BUG,
  },
  {
    label: "Select category...",
    value: "none",
  },
]

const FeedbackEditorHeader = () => {
  const { title, category, setTitle, setCategory } = useFeedbackEditor()

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(event.currentTarget.value)

  const handleCategory = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCategory(event.target.value as CategoryType)

  return (
    <Fade in timeout={500}>
      <Grid container item spacing={2} xs={12}>
        <Grid item xs={12}>
          <TextField label="Title" size="small" value={title} onChange={handleTitle} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Category"
            size="small"
            value={category}
            onChange={handleCategory}
            fullWidth
            select
          >
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
