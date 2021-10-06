import { useState, useMemo } from "react"
import {
  Button,
  BottomNavigationAction,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material"
import LinkIcon from "@mui/icons-material/Link"
import Dialog from "app/core/components/Dialog"
import { handleToolbarOptionClick, insertLink, isLinkActive, unwrapLink } from "../utils"
import { useSlate } from "slate-react"
import { BaseSelection, Editor } from "slate"

const LinkDialog: React.FC<{
  open: boolean
  onClose: () => void
  onSubmit: (link: string) => void
}> = ({ open, onClose, onSubmit }) => {
  const [link, setLink] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLink(event.currentTarget.value)

  const handleClearInput = () => setLink("")

  const handleCloseDialog = () => {
    handleClearInput()
    onClose()
  }

  const handleSubmit = () => {
    onSubmit(link)
    handleCloseDialog()
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Insert link</DialogTitle>
      <DialogContent>
        <TextField onChange={handleChange} fullWidth size="small" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Close</Button>
        <Button onClick={handleSubmit} disabled={!link}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const LinkSelector: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const editor = useSlate()

  const [selectionPath, setSelectionPath] = useState<BaseSelection | null>(null)
  const [open, setOpen] = useState(false)

  const selectedText = editor.selection ? Editor.string(editor, editor.selection) : null
  const isTextSelected = useMemo(() => Boolean(selectedText), [selectedText])
  const activeLink = isLinkActive(editor)

  const color = !isTextSelected ? "disabled" : activeLink ? "primary" : "action"

  const handleToggle = () => {
    if (activeLink) return unwrapLink(editor)
    setSelectionPath(editor.selection)
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const handleSubmit = (newLink) => {
    if (selectionPath) {
      editor.apply({
        type: "set_selection",
        properties: null,
        newProperties: selectionPath,
      })
      insertLink(editor, newLink)
      setSelectionPath(null)
    }
  }

  if (isMobile)
    return (
      <>
        <BottomNavigationAction
          onMouseDown={(e) => handleToolbarOptionClick(e, handleToggle)}
          icon={<LinkIcon color={color} />}
          disabled={!isTextSelected}
        />
        <LinkDialog open={open} onClose={handleClose} onSubmit={handleSubmit} />
      </>
    )

  return (
    <>
      <Button disabled={!isTextSelected} onClick={handleToggle}>
        <LinkIcon color={color} />
      </Button>
      <LinkDialog open={open} onClose={handleClose} onSubmit={handleSubmit} />
    </>
  )
}

export default LinkSelector
