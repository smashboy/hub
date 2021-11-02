import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"
import {
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  Autocomplete,
  Chip,
  Avatar,
  ListItemAvatar,
  MenuItem,
  ListItemText,
  TextField,
  Box,
} from "@mui/material"
import Dialog from "app/core/components/Dialog"
import searchUsers from "../mutations/searchUsers"
import { LoadingButton } from "@mui/lab"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import createProjectInvites from "../mutations/createProjectInvites"
import { Invites } from "./ManageProjectInvites"

export type Users = Array<{
  id: number
  username: string
  email: string
  avatarUrl: string | null
}>

type InviteMembersDialog = {
  open: boolean
  onClose: () => void
  name: string
  slug: string
  onSubmit: (newInvites: Invites) => void
}

const InviteMembersDialog: React.FC<InviteMembersDialog> = ({
  open,
  onClose,
  name,
  slug,
  onSubmit,
}) => {
  const [createProjectInvitesMutation, { isLoading: isLoadingCreateInvites }] = useCustomMutation(
    createProjectInvites,
    {
      successNotification: "Invitations sent successfully!",
    }
  )

  const [searchUsersMutation, { isLoading: isSearchLoading }] = useCustomMutation(searchUsers, {})

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000)
  const [users, setUsers] = useState<Users>([])
  const [selectedUsers, setSelectedUsers] = useState<Users>([])

  useEffect(() => {
    const handleSearchUsers = async () => {
      if (!debouncedSearchQuery) return setUsers([])

      const users = await searchUsersMutation({
        projectSlug: slug,
        query: debouncedSearchQuery,
      })

      setUsers(users)
    }

    handleSearchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery])

  const handleSearchUsers = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.currentTarget.value)

  const handleCreateProjectInvites = async () => {
    const newInvites = await createProjectInvitesMutation({
      projectSlug: slug,
      usersId: selectedUsers.map(({ id }) => id),
    })

    onSubmit(newInvites)

    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    onClose()
    setSelectedUsers([])
    setSearchQuery("")
    setUsers([])
  }

  return (
    <Dialog open={open} maxWidth="sm" onClose={handleCloseDialog}>
      <DialogTitle>
        Add new member to <b>{name}</b>
      </DialogTitle>
      <DialogContent>
        <Box paddingTop={1}>
          <Autocomplete
            options={users}
            value={selectedUsers}
            size="small"
            loading={isSearchLoading}
            onChange={(_, value) => setSelectedUsers(value as Users)}
            getOptionLabel={({ username, email }) => `${username} ${email}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search"
                onChange={handleSearchUsers}
                helperText="Search by username or email."
              />
            )}
            renderOption={(props, { id, username }, { selected }) =>
              selected ? null : (
                <MenuItem {...props} key={id} divider>
                  <ListItemAvatar>
                    <Avatar alt={username} src="broken" sx={{ width: 24, height: 24 }} />
                  </ListItemAvatar>
                  <ListItemText primary={username} />
                </MenuItem>
              )
            }
            renderTags={(members, getTagProps) =>
              members.map(({ id, username }, index) => (
                <Chip
                  {...getTagProps({ index })}
                  avatar={<Avatar alt={username} src="broken" />}
                  variant="outlined"
                  label={username}
                  key={id}
                />
              ))
            }
            fullWidth
            freeSolo
            multiple
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          onClick={handleCreateProjectInvites}
          loading={isLoadingCreateInvites}
          disabled={selectedUsers.length === 0}
        >
          Invite
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default InviteMembersDialog
