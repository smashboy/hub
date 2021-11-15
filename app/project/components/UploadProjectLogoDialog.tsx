import { useState } from "react"
import { LoadingButton } from "@mui/lab"
import { Button, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import Dialog from "app/core/components/Dialog"
import FileInput from "app/core/components/FileInput"

type UploadProjectLogoDialogProps = {
  open: boolean
  onClose: () => void
}

const UploadProjectLogoDialog: React.FC<UploadProjectLogoDialogProps> = ({ open, onClose }) => {
  const [image, setImage] = useState<File | null>(null)

  const handleCloseDialog = () => {
    setImage(null)
    onClose()
  }

  const handleUploadLogo = () => {}

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Upload logo</DialogTitle>
      <DialogContent>
        <FileInput
          label="Drag and drop image or click to upload"
          maxSize={20}
          allowedFileTypes={["image/jpeg", "image/png", "image/webp"]}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleCloseDialog}>
          Close
        </Button>
        <LoadingButton disabled={!image}>Upload</LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default UploadProjectLogoDialog
