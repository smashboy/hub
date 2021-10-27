import { ProjectMemberRole } from "db"
import { Grid, Button, Chip } from "@mui/material"
import RoadmapIcon from "@mui/icons-material/Map"
import ParticipantsIcon from "@mui/icons-material/PeopleAlt"
import LabelIcon from "@mui/icons-material/Label"
import SortIcon from "@mui/icons-material/Sort"
import SearchField from "app/core/components/SearchField"
import SearchDropdown from "app/core/components/SearchDropdown"
import getFeedbackSearchLabelOptions from "../queries/getFeedbackSearchLabelOptions"
import getFeedbackSearchMemberOptions from "../queries/getFeedbackSearchMemberOptions"
import getFeedbackSearchRoadmapOptions from "../queries/getFeedbackSearchRoadmapOptions"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import { FeedbackFilterKey } from "../pages/[slug]/feedback"

const FeedbackListHeader: React.FC<{
  projectSlug: string
  role: ProjectMemberRole | null
  onOptionsFilter: (key: FeedbackFilterKey) => (ids: Array<string | number>) => void
  onSearchQueryFilter: (newQuery: string) => void
}> = ({ projectSlug, role, onOptionsFilter, onSearchQueryFilter }) => {
  const isSM = useIsSmallDevice()

  const handleSeach = (event: React.ChangeEvent<HTMLInputElement>) =>
    onSearchQueryFilter(event.currentTarget.value)

  return (
    <Grid item container xs={12} spacing={1}>
      <Grid item xs={12}>
        <SearchField onChange={handleSeach} placeholder="Search feedback..." />
      </Grid>
      <Grid container item xs={12} spacing={1} justifyContent={isSM ? "center" : "flex-end"}>
        {role && (
          <>
            <SearchDropdown
              projectSlug={projectSlug}
              buttonText="Labels"
              icon={LabelIcon}
              onSubmit={onOptionsFilter("labels")}
              queryFunc={getFeedbackSearchLabelOptions}
              renderOption={({ name, description, color, id }) => ({
                id,
                primary: (
                  <Chip label={name} sx={{ bgcolor: color, pointerEvents: "none" }} size="small" />
                ),
                secondary: description,
              })}
              mapQueryResultToSearchOptions={({ id, name, description }) => ({
                id,
                query: `${name} ${description ?? ""}`,
              })}
            />
            <SearchDropdown
              projectSlug={projectSlug}
              buttonText="Members"
              icon={ParticipantsIcon}
              onSubmit={onOptionsFilter("members")}
              queryFunc={getFeedbackSearchMemberOptions}
              renderOption={({ id, user: { username } }) => ({
                id,
                primary: username,
              })}
              mapQueryResultToSearchOptions={({ id, user: { username } }) => ({
                id,
                query: username,
              })}
            />
          </>
        )}
        <SearchDropdown
          projectSlug={projectSlug}
          buttonText="Roadmaps"
          icon={RoadmapIcon}
          onSubmit={onOptionsFilter("roadmaps")}
          queryFunc={getFeedbackSearchRoadmapOptions}
          renderOption={({ id, name }) => ({
            id,
            primary: name,
          })}
          mapQueryResultToSearchOptions={({ id, name }) => ({ id, query: name })}
        />
        <Grid item xs="auto">
          <Button variant="contained" color="inherit" endIcon={<SortIcon />}>
            Sort
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default FeedbackListHeader
