import { useMemo, useState } from "react"
import { ProjectMemberRole } from "db"
import { useDebounce } from "use-debounce"
import DeleteIcon from "@mui/icons-material/Delete"
import ArrowIcon from "@mui/icons-material/ArrowDropDown"
import { Grid, Button, TextField, Typography, Menu, MenuItem } from "@mui/material"
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
import { useMemberInvitesDialog } from "../store/MemberInvitesDialogContext"
import { useConfirmDialog } from "react-mui-confirm"
import { useProject } from "../store/ProjectContext"

type ManageMembersSettingsProps = {
  members: {
    user: {
      username: string
      email: string
      avatarUrl: string | null
    }
    id: number
    role: ProjectMemberRole
  }[]
}

const roleOptions = [
  {
    label: "Founder",
    value: ProjectMemberRole.FOUNDER,
  },
  {
    label: "Admin",
    value: ProjectMemberRole.ADMIN,
  },
  {
    label: "Moderator",
    value: ProjectMemberRole.MODERATOR,
  },
  {
    label: "Member",
    value: ProjectMemberRole.MEMBER,
  },
  {
    label: "None",
    value: null,
  },
]

const ManageMembersSettings: React.FC<ManageMembersSettingsProps> = ({ members }) => {
  const {
    project: { slug },
  } = useProject()

  const { setOpen } = useMemberInvitesDialog()

  const confirm = useConfirmDialog()

  const [roleFilterMenu, setRoleFilterMenu] = useState<null | HTMLElement>(null)

  const openRoleFilterMenu = Boolean(roleFilterMenu)

  const [roleFilter, setRoleFilter] = useState<ProjectMemberRole | null>(null)

  const [updateMemberRoleMutation] = useCustomMutation(updateMemberRole, {
    successNotification: "Member status has been updated successfully!",
  })

  const [deleteProjectMemberMutation] = useCustomMutation(deleteProjectMember, {
    successNotification: "Member has been removed successfully!",
  })

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

  const filterModel: GridFilterModel = useMemo(
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
        {
          id: 3,
          columnField: "role",
          value: roleFilter,
          operatorValue: "is",
        },
      ],
      linkOperator: GridLinkOperator.Or,
    }),
    [debouncedSearchQuery, roleFilter]
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
        getActions: ({ id, row: { role, username } }) =>
          role === ProjectMemberRole.FOUNDER
            ? []
            : [
                <GridActionsCellItem
                  key={id}
                  icon={<DeleteIcon color="error" />}
                  onClick={() =>
                    confirm({
                      // @ts-ignore
                      title: (
                        <>
                          Are you sure you want to remove{" "}
                          <Typography component="span" color="primary.main">
                            {username}
                          </Typography>{" "}
                          from project?
                        </>
                      ),
                      onConfirm: async () => {
                        await handleDeleteMember(id)
                      },
                    })
                  }
                  label="Delete"
                />,
              ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows]
  )

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

  const handleOpenRoleFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
    setRoleFilterMenu(event.currentTarget)
  const handleCloseRoleFilterMenu = () => setRoleFilterMenu(null)

  const handleSelectRole = (role: ProjectMemberRole | null) => {
    setRoleFilter(role)
    handleCloseRoleFilterMenu()
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
              onClick={handleOpenRoleFilterMenu}
              variant="contained"
              color="secondary"
              endIcon={<ArrowIcon />}
              disableElevation
              fullWidth
            >
              {roleFilter ?? "Role"}
            </Button>
          </Grid>
          <Grid container item xs={12} md={3} alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={setOpen}
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
      <Menu anchorEl={roleFilterMenu} open={openRoleFilterMenu} onClose={handleCloseRoleFilterMenu}>
        {roleOptions.map(({ value, label }) => (
          <MenuItem key={label} onClick={() => handleSelectRole(value)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default ManageMembersSettings
