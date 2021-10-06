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
import DialogForm from "app/core/components/DialogForm"
import { LinkForm } from "../validations"
import LabeledTextField from "app/core/components/LabeledTextField"

const LinkDialog: React.FC<{
  open: boolean
  onClose: () => void
  onSubmit: (link: string) => void
}> = ({ open, onClose, onSubmit }) => {
  const handleSubmit = (link: string) => {
    onSubmit(link)
    onClose()
  }

  return (
    <DialogForm
      schema={LinkForm}
      submitText="Submit"
      title="Insert link"
      open={open}
      onClose={onClose}
      DialogProps={{
        maxWidth: "xs",
      }}
      onSubmit={async ({ link }) => handleSubmit(link)}
    >
      <LabeledTextField label="Link" name="link" size="small" />
    </DialogForm>
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
