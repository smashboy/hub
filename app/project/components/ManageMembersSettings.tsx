import { useMemo, useState } from "react"
import { ProjectMemberRole } from "db"
import { useDebounce } from "use-debounce"
import DeleteIcon from "@mui/icons-material/Delete"
import ArrowIcon from "@mui/icons-material/ArrowDropDown"
import { Grid, Button, TextField } from "@mui/material"
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridFilterModel,
  GridActionsCellItem,
  GridLinkOperator,
  GridCellEditCommitParams,
} from "@mui/x-data-grid"
import PaperBox from "app/core/components/PaperBox"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import updateMemberRole from "app/project/mutations/updateMemberRole"
import deleteProjectMember from "app/project/mutations/deleteProjectMember"
import InviteMembersDialog from "./InviteMembersDialog"

type ManageMembersSettingsProps = {
  slug: string
  name: string
  members: {
    user: {
      id: number
      username: string
      email: string
      avatarUrl: string | null
    }
    id: number
    role: ProjectMemberRole
  }[]
}

const ManageMembersSettings: React.FC<ManageMembersSettingsProps> = ({ members, slug, name }) => {
  const [updateMemberRoleMutation] = useCustomMutation(updateMemberRole, {
    successNotification: "Member status has been updated successfully!",
  })

  const [deleteProjectMemberMutation] = useCustomMutation(deleteProjectMember, {
    successNotification: "Member has been deleted successfully!",
  })

  const [openNewMemberDialog, setOpenNewMemberDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000)

  const [rows, setRows] = useState<GridRowsProp>(
    members.map(({ id, user: { username, email }, role }) => ({
      id,
      username,
      email,
      role,
    }))
  )

  const filterModel: GridFilterModel | undefined = useMemo(
    () => ({
      items: [
        {
          id: 1,
          columnField: "username",
          operatorValue: "contains",
          value: debouncedSearchQuery,
        },
        {
          id: 2,
          columnField: "email",
          operatorValue: "contains",
          value: debouncedSearchQuery,
        },
      ],
      linkOperator: GridLinkOperator.Or,
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
        field: "email",
        headerName: "Email",
        flex: 1,
      },
      {
        field: "role",
        headerName: "Role",
        type: "singleSelect",
        editable: true,
        flex: 1,
        valueOptions: [
          ProjectMemberRole.MEMBER,
          ProjectMemberRole.MODERATOR,
          ProjectMemberRole.ADMIN,
        ],
      },
      {
        field: "actions",
        type: "actions",
        getActions: ({ id, row: { role } }) =>
          role === ProjectMemberRole.FOUNDER
            ? []
            : [
                <GridActionsCellItem
                  key={id}
                  icon={<DeleteIcon color="error" />}
                  onClick={() => handleDeleteMember(id)}
                  label="Delete"
                />,
              ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows]
  )

  const handleOpenNewMemberDialog = () => setOpenNewMemberDialog(true)
  const handleCloseNewMemberDialog = () => setOpenNewMemberDialog(false)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.currentTarget.value)

  const handleUpdateMemberRole = async (params: GridCellEditCommitParams) => {
    await updateMemberRoleMutation({
      projectSlug: slug,
      memberId: params.id as number,
      role: params.value as any,
    })

    const updatedRows = rows.map((row) =>
      row.id === params.id ? { ...row, role: params.value } : row
    )

    setRows(updatedRows)
  }

  const handleDeleteMember = async (memberId: number) => {
    await deleteProjectMemberMutation({
      projectSlug: slug,
      memberId,
    })

    const updatedRows = rows.filter((row) => row.id !== memberId)

    setRows(updatedRows)
  }

  return (
    <>
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenNewMemberDialog}
              disableElevation
              fullWidth
            >
              Add members
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ height: "100%" }}>
            <DataGrid
              columns={columns}
              rows={rows}
              filterModel={filterModel}
              isCellEditable={({ row: { role } }) => role !== ProjectMemberRole.FOUNDER}
              autoPageSize
              // checkboxSelection
              disableColumnMenu
              disableSelectionOnClick
              onCellEditCommit={handleUpdateMemberRole}
            />
          </Grid>
        </Grid>
      </PaperBox>
      <InviteMembersDialog
        open={openNewMemberDialog}
        onClose={handleCloseNewMemberDialog}
        name={name}
        slug={slug}
      />
    </>
  )
}

export default ManageMembersSettings
