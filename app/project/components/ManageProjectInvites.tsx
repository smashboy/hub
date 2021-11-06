import { useMemo, useState } from "react"
import { useDebounce } from "use-debounce"
import { Grid, Button, TextField, Typography } from "@mui/material"
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridFilterModel,
  GridActionsCellItem,
  GridLinkOperator,
} from "@mui/x-data-grid"
import CancelIcon from "@mui/icons-material/Close"
import PaperBox from "app/core/components/PaperBox"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import deleteProjectInvite from "../mutations/deleteProjectInvite"
import InviteMembersDialog from "./InviteMembersDialog"
import { useMemberInvitesDialog } from "../store/MemberInvitesDialogContext"
import { useConfirmDialog } from "react-mui-confirm"

export type Invites = Array<{
  id: number
  user: {
    username: string
    email: string
    avatarUrl: string | null
  }
}>

type ManageInvitesSettingsProps = {
  slug: string
  name: string
  invites: Invites
}

const ManageInvitesSettings: React.FC<ManageInvitesSettingsProps> = ({ invites, slug, name }) => {
  const { open, setClose } = useMemberInvitesDialog()

  const confirm = useConfirmDialog()

  const [deleteProjectInviteMutation] = useCustomMutation(deleteProjectInvite, {
    successNotification: "Invite has been canceled!",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000)

  const [rows, setRows] = useState<GridRowsProp>(
    invites.map(({ id, user: { username, email } }) => ({
      id,
      username,
      email,
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
        field: "actions",
        type: "actions",
        getActions: ({ id, row: { username } }) => [
          <GridActionsCellItem
            key={id}
            icon={<CancelIcon color="error" />}
            onClick={() =>
              confirm({
                // @ts-ignore
                title: (
                  <>
                    Are you sure you want to remove invite for{" "}
                    <Typography component="span" color="primary.main">
                      {username}
                    </Typography>
                    ?
                  </>
                ),
                onConfirm: async () => {
                  await handleDeleteProjectInvite(id)
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

  const handleDeleteProjectInvite = async (inviteId: number) => {
    await deleteProjectInviteMutation({
      inviteId,
      projectSlug: slug,
    })

    const updatedRows = rows.filter((row) => row.id !== inviteId)

    setRows(updatedRows)
  }

  const handleProjectInvites = (newInvites: Invites) => {
    const newRows = newInvites.map(({ id, user: { username, email } }) => ({
      id,
      username,
      email,
    }))
    setRows((prevState) => [...prevState, ...newRows])
  }

  return (
    <>
      <PaperBox title="Pending invites" sx={{ height: 400, paddingBottom: 9 }}>
        <Grid container sx={{ height: "100%" }} spacing={1}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              size="small"
              label="Search"
              onChange={handleSearch}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sx={{ height: "100%" }}>
            <DataGrid
              columns={columns}
              rows={rows}
              filterModel={filterModel}
              autoPageSize
              disableColumnMenu
              disableSelectionOnClick
            />
          </Grid>
        </Grid>
      </PaperBox>
      <InviteMembersDialog
        open={open}
        onClose={setClose}
        name={name}
        slug={slug}
        onSubmit={handleProjectInvites}
      />
    </>
  )
}

export default ManageInvitesSettings
