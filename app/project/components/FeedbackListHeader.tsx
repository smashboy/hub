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
import { ProjectMemberRole } from "db"

const FeedbackListHeader: React.FC<{ projectSlug: string; role: ProjectMemberRole | null }> = ({
  projectSlug,
  role,
}) => {
  const isSM = useIsSmallDevice()

  return (
    <Grid item container xs={12} spacing={1}>
      <Grid item xs={12}>
        <SearchField placeholder="Search feedback..." />
      </Grid>
      <Grid container item xs={12} spacing={1} justifyContent={isSM ? "center" : "flex-end"}>
        {role && (
          <>
            <SearchDropdown
              projectSlug={projectSlug}
              buttonText="Labels"
              icon={LabelIcon}
              onSubmit={() => {}}
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
              multiSelect
            />
            <SearchDropdown
              projectSlug={projectSlug}
              buttonText="Members"
              icon={ParticipantsIcon}
              onSubmit={() => {}}
              queryFunc={getFeedbackSearchMemberOptions}
              renderOption={({ id, user: { username } }) => ({
                id,
                primary: username,
              })}
              mapQueryResultToSearchOptions={({ id, user: { username } }) => ({
                id,
                query: username,
              })}
              multiSelect
            />
          </>
        )}
        <SearchDropdown
          projectSlug={projectSlug}
          buttonText="Roadmaps"
          icon={RoadmapIcon}
          onSubmit={() => {}}
          queryFunc={getFeedbackSearchRoadmapOptions}
          renderOption={({ id, name }) => ({
            id,
            primary: name,
          })}
          mapQueryResultToSearchOptions={({ id, name }) => ({ id, query: name })}
          multiSelect
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
