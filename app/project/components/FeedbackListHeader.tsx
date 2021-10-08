import { Grid, Button, ButtonGroup } from "@mui/material"
import AuthorIcon from "@mui/icons-material/Person"
import RoadmapIcon from "@mui/icons-material/Map"
import ParticipantsIcon from "@mui/icons-material/PeopleAlt"
import LabelIcon from "@mui/icons-material/Label"
import SortIcon from "@mui/icons-material/Sort"
import SearchField from "app/core/components/SearchField"

const FeedbackListHeader = () => {
  return (
    <Grid item container xs={12} spacing={1}>
      <Grid item xs={12}>
        <SearchField placeholder="Search feedback..." />
      </Grid>
      <Grid item xs={12}>
        <ButtonGroup variant="contained" color="inherit" aria-label="split button" fullWidth>
          <Button endIcon={<LabelIcon />}>Labels</Button>
          <Button endIcon={<AuthorIcon />}>Author</Button>
          <Button endIcon={<ParticipantsIcon />}>Participants</Button>
          <Button endIcon={<RoadmapIcon />}>Roadmaps</Button>
          <Button endIcon={<SortIcon />}>Sort</Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  )
}

export default FeedbackListHeader
