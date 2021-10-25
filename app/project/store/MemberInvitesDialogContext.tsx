import { createContext, useContext, useState } from "react"

type MemberInvitesDialogStore = {
  open: boolean
  setOpen: () => void
  setClose: () => void
}

const MemberInvitesDialogContext = createContext<MemberInvitesDialogStore | null>(null)

export const MemberInvitesDialogProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <MemberInvitesDialogContext.Provider
      value={{
        open,
        setOpen: handleOpen,
        setClose: handleClose,
      }}
    >
      {children}
    </MemberInvitesDialogContext.Provider>
  )
}

export const useMemberInvitesDialog = () => {
  const store = useContext(MemberInvitesDialogContext)

  if (!store)
    throw new Error("useMemberInvitesDialog must be used within MemberInvitesDialogProvider")

  return store
}
