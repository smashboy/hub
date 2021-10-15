import { useMemo, useState } from "react"
import { ProjectMemberRole } from "db"
import { BlitzPage, getSession, GetServerSideProps } from "blitz"
import { useDebounce } from "use-debounce"
import { Grid, Button, Fade, TextField } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ArrowIcon from "@mui/icons-material/ArrowDropDown"
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridFilterModel,
  GridActionsCellItem,
} from "@mui/x-data-grid"
import {
  getProjectInfo,
  getProjectMembersSettings,
  MembersSettingsPageProps,
} from "app/project/helpers"
import { authConfig } from "app/core/configs/authConfig"
import ProjectSettingsLayout from "app/project/layouts/ProjectSettingsLayout"
import PaperBox from "app/core/components/PaperBox"

const MembersSettingPage: BlitzPage<MembersSettingsPageProps> = ({
  memberSettings: { members, authMemberRole },
}: MembersSettingsPageProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000)

  const filterModel: GridFilterModel | undefined = useMemo(
    () => ({
      items: [
        {
          columnField: "username",
          operatorValue: "contains",
          value: debouncedSearchQuery,
        },
      ],
    }),
    [debouncedSearchQuery]
  )

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Id",
        hide: true,
      },
      {
        field: "username",
        headerName: "Username",
        flex: 1,
      },
      {
        field: "role",
        headerName: "Role",
        type: "singleSelect",
        flex: 1,
        valueOptions: Object.values(ProjectMemberRole),
      },
      {
        field: "actions",
        type: "actions",
        getActions: ({ id, row: { role } }) =>
          authMemberRole !== ProjectMemberRole.FOUNDER && role === ProjectMemberRole.FOUNDER
            ? []
            : [
                <GridActionsCellItem key={id} icon={<EditIcon color="primary" />} label="Edit" />,
                <GridActionsCellItem key={id} icon={<DeleteIcon color="error" />} label="Delete" />,
              ],
      },
    ],
    []
  )

  const rows: GridRowsProp = members.map(({ id, user: { username }, role }) => ({
    id,
    username,
    role,
  }))

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.currentTarget.value)

  return (
    <Grid container spacing={2}>
      <Fade in timeout={500}>
        <Grid item xs={12}>
          <PaperBox title="Manage" sx={{ height: 400, paddingBottom: 9 }}>
            <Grid container sx={{ height: "100%" }} spacing={1}>
              <Grid item xs={12} md={7}>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Search"
                  onChange={handleSearch}
                  fullWidth
                />
              </Grid>
              <Grid container item xs={12} md={2} alignItems="center">
                <Button
                  variant="contained"
                  color="inherit"
                  endIcon={<ArrowIcon />}
                  disableElevation
                  fullWidth
                >
                  Type
                </Button>
              </Grid>
              <Grid container item xs={12} md={3} alignItems="center">
                <Button variant="contained" color="primary" disableElevation fullWidth>
                  Add members
                </Button>
              </Grid>

              <Grid item xs={12} sx={{ height: "100%" }}>
                <DataGrid
                  columns={columns}
                  rows={rows}
                  filterModel={filterModel}
                  autoPageSize
                  // checkboxSelection
                  disableColumnMenu
                  disableSelectionOnClick
                />
              </Grid>
            </Grid>
          </PaperBox>
        </Grid>
      </Fade>
    </Grid>
  )
}

MembersSettingPage.authenticate = authConfig

MembersSettingPage.getLayout = (page, props: MembersSettingsPageProps) => (
  <ProjectSettingsLayout
    title={`${props.project.name} Members settings`}
    {...props}
    selectedTab="members"
  >
    {page}
  </ProjectSettingsLayout>
)

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getSession(req, res)
  const slug = (params?.slug as string) || null

  const projectProps = await getProjectInfo(slug, session, [
    ProjectMemberRole.ADMIN,
    ProjectMemberRole.FOUNDER,
  ])

  if (!projectProps)
    return {
      notFound: true,
    }

  const settingsProps = await getProjectMembersSettings(slug!, session)

  return {
    props: { ...projectProps, ...settingsProps },
  }
}

export default MembersSettingPage
